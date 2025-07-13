import { OptimizationSettings, optimizeDirectory } from "@/lib/code-optimizer";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Interface pour les résultats d'analyse
interface AnalysisResult {
  totalFiles: number;
  consoleStatements: number;
  anyTypes: number;
  legacyComponents: number;
  bundleSize: string;
  codeQuality: number;
  performanceScore: number;
  detailedResults: {
    filesWithConsole: string[];
    filesWithAnyTypes: string[];
    legacyComponentFiles: string[];
  };
}

// Fonction pour analyser récursivement les fichiers
async function analyzeDirectory(
  dirPath: string,
  results: AnalysisResult,
): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Ignorer certains dossiers
        if (
          !["node_modules", ".next", ".git", "dist", "build"].includes(
            entry.name,
          )
        ) {
          await analyzeDirectory(fullPath, results);
        }
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
      ) {
        results.totalFiles++;
        await analyzeFile(fullPath, results);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de l'analyse du répertoire ${dirPath}:`, error);
  }
}

// Fonction pour analyser un fichier spécifique
async function analyzeFile(
  filePath: string,
  results: AnalysisResult,
): Promise<void> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const relativePath = path.relative(process.cwd(), filePath);

    // Détecter console statements
    const consoleMatches = content.match(
      /console\.(log|debug|info|warn|table|time|timeEnd)\s*\(/g,
    );
    if (consoleMatches && consoleMatches.length > 0) {
      results.consoleStatements += consoleMatches.length;
      if (!results.detailedResults.filesWithConsole.includes(relativePath)) {
        results.detailedResults.filesWithConsole.push(relativePath);
      }
    }

    // Détecter types 'any'
    const anyTypeMatches = content.match(
      /:\s*any\b|<any>|any\[\]|Record<string,\s*any>/g,
    );
    if (anyTypeMatches && anyTypeMatches.length > 0) {
      results.anyTypes += anyTypeMatches.length;
      if (!results.detailedResults.filesWithAnyTypes.includes(relativePath)) {
        results.detailedResults.filesWithAnyTypes.push(relativePath);
      }
    }

    // Détecter composants legacy
    const legacyPatterns = [
      /useReactTable/g,
      /<DataTable[^>]*>/g,
      /react-pdf/g,
      /jsPDF/g,
    ];

    let hasLegacyPatterns = false;
    for (const pattern of legacyPatterns) {
      if (pattern.test(content)) {
        hasLegacyPatterns = true;
        break;
      }
    }

    if (hasLegacyPatterns) {
      results.legacyComponents++;
      if (
        !results.detailedResults.legacyComponentFiles.includes(relativePath)
      ) {
        results.detailedResults.legacyComponentFiles.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de l'analyse du fichier ${filePath}:`, error);
  }
}

// Calculer la taille approximative du bundle
async function calculateBundleSize(): Promise<string> {
  try {
    // Approximation basée sur la taille des fichiers source
    const srcPath = path.join(process.cwd(), "src");
    let totalSize = 0;

    async function calculateDirSize(dirPath: string): Promise<void> {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);

          if (entry.isDirectory()) {
            await calculateDirSize(fullPath);
          } else if (entry.isFile()) {
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
          }
        }
      } catch (error) {
        // Ignorer les erreurs de fichiers individuels
      }
    }

    await calculateDirSize(srcPath);

    // Estimer la taille du bundle (généralement ~30% de la taille source)
    const bundleSize = Math.round((totalSize * 0.3) / 1024); // En KB

    if (bundleSize > 1024) {
      return `${(bundleSize / 1024).toFixed(1)}MB`;
    } else {
      return `${bundleSize}KB`;
    }
  } catch (error) {
    console.error("Erreur lors du calcul de la taille du bundle:", error);
    return "N/A";
  }
}

export async function GET(request: NextRequest) {
  try {
    const results: AnalysisResult = {
      totalFiles: 0,
      consoleStatements: 0,
      anyTypes: 0,
      legacyComponents: 0,
      bundleSize: "0KB",
      codeQuality: 0,
      performanceScore: 0,
      detailedResults: {
        filesWithConsole: [],
        filesWithAnyTypes: [],
        legacyComponentFiles: [],
      },
    };

    // Analyser le répertoire src
    const srcPath = path.join(process.cwd(), "src");
    await analyzeDirectory(srcPath, results);

    // Calculer la taille du bundle
    results.bundleSize = await calculateBundleSize();

    // Calculer les scores de qualité et performance
    if (results.totalFiles > 0) {
      // Score de qualité basé sur la proportion de code propre
      const cleanCodeRatio =
        (results.totalFiles -
          results.detailedResults.filesWithConsole.length -
          results.detailedResults.filesWithAnyTypes.length) /
        results.totalFiles;
      results.codeQuality = Math.max(
        0,
        Math.min(100, Math.round(cleanCodeRatio * 100)),
      );

      // Score de performance basé sur l'absence de patterns legacy
      const modernCodeRatio =
        (results.totalFiles -
          results.detailedResults.legacyComponentFiles.length) /
        results.totalFiles;
      results.performanceScore = Math.max(
        0,
        Math.min(100, Math.round(modernCodeRatio * 85 + 15)),
      ); // Base de 15%
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de l'analyse du codebase:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'analyse du codebase",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, settings } = body;

    if (action === "optimize") {
      console.log("🚀 DÉBUT DE L'OPTIMISATION RÉELLE...");
      console.log("⚙️ Paramètres:", settings);

      // Configuration de l'optimisation
      const optimizationSettings: OptimizationSettings = {
        autoCleanConsole: settings.autoCleanConsole || false,
        strictTypeChecking: settings.strictTypeChecking || false,
        legacyMigration: settings.legacyMigration || false,
        createBackup: true, // Toujours créer un backup pour la sécurité
      };

      try {
        // Lancer l'optimisation réelle sur le dossier src
        const srcPath = path.join(process.cwd(), "src");
        const optimizationResult = await optimizeDirectory(
          srcPath,
          optimizationSettings,
        );

        // Préparer les résultats pour l'interface
        const results = {
          success: true,
          optimizationsApplied: [] as string[],
          filesModified: optimizationResult.filesModified.length,
          backupCreated: optimizationResult.backupCreated,
          improvements: {
            consoleStatementsRemoved:
              optimizationResult.consoleStatementsRemoved,
            typesOptimized: optimizationResult.typesOptimized,
            componentsUpgraded: optimizationResult.componentsUpgraded,
          },
          detailedResults: {
            modifiedFiles: optimizationResult.filesModified.map((f) =>
              path.relative(process.cwd(), f),
            ),
          },
        };

        // Ajouter les optimisations appliquées
        if (
          optimizationSettings.autoCleanConsole &&
          optimizationResult.consoleStatementsRemoved > 0
        ) {
          results.optimizationsApplied.push("Console cleanup");
        }

        if (
          optimizationSettings.strictTypeChecking &&
          optimizationResult.typesOptimized > 0
        ) {
          results.optimizationsApplied.push("Type optimization");
        }

        if (
          optimizationSettings.legacyMigration &&
          optimizationResult.componentsUpgraded > 0
        ) {
          results.optimizationsApplied.push("Legacy migration");
        }

        console.log("✅ OPTIMISATION TERMINÉE AVEC SUCCÈS!");
        console.log(`📁 ${results.filesModified} fichiers modifiés`);
        console.log(
          `🧹 ${results.improvements.consoleStatementsRemoved} console statements supprimés`,
        );
        console.log(
          `🔧 ${results.improvements.typesOptimized} types optimisés`,
        );
        console.log(
          `⬆️ ${results.improvements.componentsUpgraded} composants upgradés`,
        );
        console.log(`📦 Backup créé: ${results.backupCreated}`);

        return NextResponse.json({
          success: true,
          data: results,
          timestamp: new Date().toISOString(),
        });
      } catch (optimizationError) {
        console.error("❌ ERREUR DURANT L'OPTIMISATION:", optimizationError);

        return NextResponse.json(
          {
            success: false,
            error: "Erreur durant l'optimisation",
            details:
              optimizationError instanceof Error
                ? optimizationError.message
                : "Erreur inconnue",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Action non supportée",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("❌ ERREUR LORS DE L'OPTIMISATION:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'optimisation",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
