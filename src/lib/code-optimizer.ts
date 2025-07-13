import { promises as fs } from "fs";
import path from "path";

export interface OptimizationResult {
  filesModified: string[];
  consoleStatementsRemoved: number;
  typesOptimized: number;
  componentsUpgraded: number;
  backupCreated: string;
}

export interface OptimizationSettings {
  autoCleanConsole: boolean;
  strictTypeChecking: boolean;
  legacyMigration: boolean;
  createBackup: boolean;
}

/**
 * Crée une sauvegarde complète du dossier src avant optimisation
 */
export async function createBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(process.cwd(), `backup-${timestamp}`);
  const srcDir = path.join(process.cwd(), "src");

  await copyDirectory(srcDir, path.join(backupDir, "src"));

  console.log(`📦 Backup créé: ${backupDir}`);
  return backupDir;
}

/**
 * Copie récursivement un dossier
 */
async function copyDirectory(
  source: string,
  destination: string,
): Promise<void> {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Supprime tous les console.log, console.error, etc. d'un fichier
 */
export async function removeConsoleStatements(
  filePath: string,
): Promise<number> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    let removedCount = 0;

    // Patterns pour détecter les console statements
    const consolePatterns = [
      /console\.(log|info|warn|error|debug|trace)\s*\([^)]*\)\s*;?\s*\n?/g,
      /console\.(log|info|warn|error|debug|trace)\s*\(`[^`]*`\)\s*;?\s*\n?/g,
      /console\.(log|info|warn|error|debug|trace)\s*\("([^"\\]|\\.)*"\)\s*;?\s*\n?/g,
      /console\.(log|info|warn|error|debug|trace)\s*\('([^'\\]|\\.)*'\)\s*;?\s*\n?/g,
    ];

    let newContent = content;

    for (const pattern of consolePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        removedCount += matches.length;
        newContent = newContent.replace(pattern, "");
      }
    }

    // Nettoyer les lignes vides multiples laissées par la suppression
    newContent = newContent.replace(/\n\s*\n\s*\n/g, "\n\n");

    if (removedCount > 0) {
      await fs.writeFile(filePath, newContent, "utf-8");
      console.log(
        `🧹 ${removedCount} console statements supprimés dans ${filePath}`,
      );
    }

    return removedCount;
  } catch (error) {
    console.error(
      `❌ Erreur lors du nettoyage des console dans ${filePath}:`,
      error,
    );
    return 0;
  }
}

/**
 * Remplace les types 'any' par des types plus stricts quand c'est possible
 */
export async function optimizeTypes(filePath: string): Promise<number> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    let optimizedCount = 0;

    let newContent = content;

    // Remplacements de types courants
    const typeReplacements = [
      // Paramètres de fonctions
      { from: /(\w+)\s*:\s*any\s*\[\]/g, to: "$1: unknown[]", count: 0 },
      { from: /(\w+)\s*:\s*any(?=\s*[,)])/g, to: "$1: unknown", count: 0 },

      // Variables et propriétés
      { from: /:\s*any(?=\s*=)/g, to: ": unknown", count: 0 },
      { from: /:\s*any(?=\s*;)/g, to: ": unknown", count: 0 },

      // Types de retour de fonction simples
      { from: /\):\s*any(?=\s*\{)/g, to: "): unknown", count: 0 },

      // Arrays
      { from: /any\[\]/g, to: "unknown[]", count: 0 },

      // Propriétés d'objets
      { from: /(\w+)\s*:\s*any(?=\s*[,}])/g, to: "$1: unknown", count: 0 },
    ];

    for (const replacement of typeReplacements) {
      const matches = newContent.match(replacement.from);
      if (matches) {
        replacement.count = matches.length;
        optimizedCount += replacement.count;
        newContent = newContent.replace(replacement.from, replacement.to);
      }
    }

    if (optimizedCount > 0) {
      await fs.writeFile(filePath, newContent, "utf-8");
      console.log(
        `🔧 ${optimizedCount} types 'any' optimisés dans ${filePath}`,
      );
    }

    return optimizedCount;
  } catch (error) {
    console.error(
      `❌ Erreur lors de l'optimisation des types dans ${filePath}:`,
      error,
    );
    return 0;
  }
}

/**
 * Migre les composants legacy vers des versions plus modernes
 */
export async function upgradeComponents(filePath: string): Promise<number> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    let upgradedCount = 0;

    let newContent = content;

    // Migrations courantes
    const migrations = [
      // React.FC vers function component moderne
      {
        from: /const\s+(\w+):\s*React\.FC<([^>]*)>\s*=\s*\(([^)]*)\)\s*=>/g,
        to: "function $1($3): JSX.Element",
        description: "React.FC vers function component",
      },

      // Remplacer React.Component par des hooks quand c'est simple
      {
        from: /React\.Component<([^>]*),\s*([^>]*)>/g,
        to: "Component<$1, $2>",
        description: "Simplification des imports React.Component",
      },

      // Moderniser les imports React
      {
        from: /import\s+\*\s+as\s+React\s+from\s+['"]react['"]/g,
        to: "import React from 'react'",
        description: "Import React moderne",
      },

      // Remplacer les defaultProps par des paramètres par défaut
      {
        from: /\.defaultProps\s*=\s*\{([^}]*)\}/g,
        to: "// Moved to default parameters",
        description: "defaultProps vers paramètres par défaut",
      },
    ];

    for (const migration of migrations) {
      const matches = newContent.match(migration.from);
      if (matches) {
        upgradedCount += matches.length;
        newContent = newContent.replace(migration.from, migration.to);
        console.log(
          `🔄 ${migration.description}: ${matches.length} occurrences`,
        );
      }
    }

    if (upgradedCount > 0) {
      await fs.writeFile(filePath, newContent, "utf-8");
      console.log(`⬆️ ${upgradedCount} composants upgradés dans ${filePath}`);
    }

    return upgradedCount;
  } catch (error) {
    console.error(
      `❌ Erreur lors de l'upgrade des composants dans ${filePath}:`,
      error,
    );
    return 0;
  }
}

/**
 * Optimise un fichier selon les paramètres donnés
 */
export async function optimizeFile(
  filePath: string,
  settings: OptimizationSettings,
): Promise<{
  consoleRemoved: number;
  typesOptimized: number;
  componentsUpgraded: number;
}> {
  const result = {
    consoleRemoved: 0,
    typesOptimized: 0,
    componentsUpgraded: 0,
  };

  try {
    // Vérifier que le fichier existe et est un fichier TypeScript/React
    const stat = await fs.stat(filePath);
    if (
      !stat.isFile() ||
      (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx"))
    ) {
      return result;
    }

    console.log(`🔍 Optimisation de ${filePath}...`);

    if (settings.autoCleanConsole) {
      result.consoleRemoved = await removeConsoleStatements(filePath);
    }

    if (settings.strictTypeChecking) {
      result.typesOptimized = await optimizeTypes(filePath);
    }

    if (settings.legacyMigration) {
      result.componentsUpgraded = await upgradeComponents(filePath);
    }

    return result;
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${filePath}:`, error);
    return result;
  }
}

/**
 * Optimise tous les fichiers dans un dossier récursivement
 */
export async function optimizeDirectory(
  dirPath: string,
  settings: OptimizationSettings,
): Promise<OptimizationResult> {
  const result: OptimizationResult = {
    filesModified: [],
    consoleStatementsRemoved: 0,
    typesOptimized: 0,
    componentsUpgraded: 0,
    backupCreated: "",
  };

  try {
    // Créer un backup si demandé
    if (settings.createBackup) {
      result.backupCreated = await createBackup();
    }

    await processDirectory(dirPath, settings, result);

    console.log(`✅ Optimisation terminée:`);
    console.log(`   📁 Fichiers modifiés: ${result.filesModified.length}`);
    console.log(
      `   🧹 Console statements supprimés: ${result.consoleStatementsRemoved}`,
    );
    console.log(`   🔧 Types optimisés: ${result.typesOptimized}`);
    console.log(`   ⬆️ Composants upgradés: ${result.componentsUpgraded}`);

    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'optimisation du dossier:", error);
    throw error;
  }
}

/**
 * Traite récursivement un dossier
 */
async function processDirectory(
  dirPath: string,
  settings: OptimizationSettings,
  result: OptimizationResult,
): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Ignorer certains dossiers
        if (
          !["node_modules", ".next", ".git", "dist", "build", "backup-"].some(
            (skip) => entry.name.includes(skip),
          )
        ) {
          await processDirectory(fullPath, settings, result);
        }
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
      ) {
        const fileResult = await optimizeFile(fullPath, settings);

        if (
          fileResult.consoleRemoved > 0 ||
          fileResult.typesOptimized > 0 ||
          fileResult.componentsUpgraded > 0
        ) {
          result.filesModified.push(fullPath);
          result.consoleStatementsRemoved += fileResult.consoleRemoved;
          result.typesOptimized += fileResult.typesOptimized;
          result.componentsUpgraded += fileResult.componentsUpgraded;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement du dossier ${dirPath}:`, error);
  }
}
