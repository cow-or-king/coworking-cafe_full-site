/**
 * Automated Migration System
 * Automatically migrates legacy components to new optimized systems
 *
 * Features:
 * - Pattern detection and replacement
 * - Component analysis and recommendations
 * - Automated refactoring suggestions
 * - Migration validation
 */

import * as fs from "fs";
import * as path from "path";

// Types pour le système de migration
interface MigrationRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  category: "table" | "form" | "pdf" | "card" | "performance" | "cleanup";
  priority: "high" | "medium" | "low";
  estimatedReduction: number; // Pourcentage de réduction de code
}

interface MigrationResult {
  file: string;
  rulesApplied: string[];
  originalSize: number;
  newSize: number;
  reduction: number;
  errors: string[];
  warnings: string[];
}

interface ComponentAnalysis {
  file: string;
  componentType: "table" | "form" | "pdf" | "card" | "generic" | "unknown";
  complexity: "low" | "medium" | "high";
  migrationPriority: "high" | "medium" | "low";
  recommendedMigration: string[];
  estimatedEffort: "easy" | "medium" | "complex";
  codeSmells: string[];
  metrics: {
    lineCount: number;
    cyclomaticComplexity: number;
    duplicatedCode: number;
    testCoverage?: number;
  };
}

// Règles de migration prédéfinies
export const MIGRATION_RULES: MigrationRule[] = [
  // Migration vers AdvancedTable
  {
    id: "table-to-advanced",
    name: "Migrate to AdvancedTable",
    description: "Convert legacy data tables to AdvancedTable system",
    pattern:
      /function\s+(\w*DataTable\w*)\s*\([^)]*\)\s*\{[\s\S]*?useReactTable[\s\S]*?\}/g,
    replacement: (match, componentName) => `
// TODO: Migrated to AdvancedTable
// Original component: ${componentName}
// Migration: Replace with AdvancedTable configuration
/*
const tableConfig = {
  columns: [
    // Define columns configuration
  ],
  data: your_data,
  // Add other AdvancedTable props
};
return <AdvancedTable {...tableConfig} />;
*/
`,
    category: "table",
    priority: "high",
    estimatedReduction: 70,
  },

  // Nettoyage des console.log
  {
    id: "remove-console-logs",
    name: "Remove console statements",
    description: "Remove debug console statements",
    pattern: /console\.(log|debug|info|warn|error)\([^)]*\);?\s*\n?/g,
    replacement: "",
    category: "cleanup",
    priority: "medium",
    estimatedReduction: 5,
  },

  // Nettoyage des commentaires TODO/FIXME
  {
    id: "remove-todo-comments",
    name: "Remove TODO comments",
    description: "Remove TODO and FIXME comments",
    pattern: /\/\/ (TODO|FIXME|HACK):.*\n/g,
    replacement: "",
    category: "cleanup",
    priority: "low",
    estimatedReduction: 2,
  },

  // Migration des formulaires vers AdvancedForm
  {
    id: "form-to-advanced",
    name: "Migrate to AdvancedForm",
    description: "Convert legacy forms to AdvancedForm system",
    pattern:
      /function\s+(\w*Form\w*)\s*\([^)]*\)\s*\{[\s\S]*?useState[\s\S]*?onSubmit[\s\S]*?\}/g,
    replacement: (match, componentName) => `
// TODO: Migrated to AdvancedForm
// Original component: ${componentName}
// Migration: Replace with AdvancedForm configuration
/*
const formConfig = {
  sections: [{
    title: "Form Section",
    fields: [
      // Define fields configuration
    ]
  }]
};
return <AdvancedForm config={formConfig} />;
*/
`,
    category: "form",
    priority: "high",
    estimatedReduction: 60,
  },

  // Optimisation des imports
  {
    id: "optimize-imports",
    name: "Optimize imports",
    description: "Remove unused imports and optimize import statements",
    pattern: /import\s+[^;]+;[\s\n]*(?=\/\/\s*unused|$)/g,
    replacement: "",
    category: "performance",
    priority: "medium",
    estimatedReduction: 3,
  },

  // Migration des PDF vers GenericPDF
  {
    id: "pdf-to-generic",
    name: "Migrate to GenericPDF",
    description: "Convert legacy PDF components to GenericPDF system",
    pattern: /function\s+(\w*PDF\w*)\s*\([^)]*\)\s*\{[\s\S]*?jsPDF[\s\S]*?\}/g,
    replacement: (match, componentName) => `
// TODO: Migrated to GenericPDF
// Original component: ${componentName}
// Migration: Replace with GenericPDF configuration
/*
const pdfConfig = {
  title: "Document Title",
  sections: [
    {
      type: 'table',
      data: your_data,
      columns: [
        // Define columns
      ]
    }
  ]
};
return <GenericPDF config={pdfConfig} />;
*/
`,
    category: "pdf",
    priority: "high",
    estimatedReduction: 80,
  },
];

// Classe principale pour la migration automatique
export class AutoMigrator {
  private rules: MigrationRule[];
  private baseDirectory: string;

  constructor(baseDirectory: string, customRules: MigrationRule[] = []) {
    this.baseDirectory = baseDirectory;
    this.rules = [...MIGRATION_RULES, ...customRules];
  }

  // Analyser un fichier et détecter les opportunités de migration
  async analyzeFile(filePath: string): Promise<ComponentAnalysis> {
    const fullPath = path.join(this.baseDirectory, filePath);
    const content = await fs.promises.readFile(fullPath, "utf-8");

    const lineCount = content.split("\n").length;
    const complexity = this.calculateComplexity(content);
    const componentType = this.detectComponentType(content);
    const codeSmells = this.detectCodeSmells(content);

    return {
      file: filePath,
      componentType,
      complexity: lineCount > 500 ? "high" : lineCount > 200 ? "medium" : "low",
      migrationPriority: this.calculateMigrationPriority(
        content,
        componentType,
        lineCount,
      ),
      recommendedMigration: this.getRecommendedMigrations(content),
      estimatedEffort: this.estimateEffort(complexity, lineCount),
      codeSmells,
      metrics: {
        lineCount,
        cyclomaticComplexity: complexity,
        duplicatedCode: this.detectDuplicatedCode(content),
      },
    };
  }

  // Appliquer les migrations automatiques à un fichier
  async migrateFile(
    filePath: string,
    ruleIds?: string[],
  ): Promise<MigrationResult> {
    const fullPath = path.join(this.baseDirectory, filePath);
    const originalContent = await fs.promises.readFile(fullPath, "utf-8");
    const originalSize = originalContent.length;

    let newContent = originalContent;
    const rulesApplied: string[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    const rulesToApply = ruleIds
      ? this.rules.filter((rule) => ruleIds.includes(rule.id))
      : this.rules;

    for (const rule of rulesToApply) {
      try {
        const before = newContent;

        if (typeof rule.replacement === "string") {
          newContent = newContent.replace(rule.pattern, rule.replacement);
        } else {
          newContent = newContent.replace(rule.pattern, rule.replacement);
        }

        if (before !== newContent) {
          rulesApplied.push(rule.id);
          console.log(`✅ Applied rule: ${rule.name} to ${filePath}`);
        }
      } catch (error) {
        errors.push(`Error applying rule ${rule.id}: ${error}`);
      }
    }

    const newSize = newContent.length;
    const reduction = Math.round(
      ((originalSize - newSize) / originalSize) * 100,
    );

    // Sauvegarder le fichier migré si des changements ont été appliqués
    if (rulesApplied.length > 0) {
      await fs.promises.writeFile(fullPath, newContent, "utf-8");
    }

    return {
      file: filePath,
      rulesApplied,
      originalSize,
      newSize,
      reduction,
      errors,
      warnings,
    };
  }

  // Migrer tous les fichiers dans un répertoire
  async migrateDirectory(
    directory: string = "",
    filePattern: RegExp = /\.tsx?$/,
  ): Promise<MigrationResult[]> {
    const fullDirectory = path.join(this.baseDirectory, directory);
    const files = await this.getFilesRecursively(fullDirectory, filePattern);

    const results: MigrationResult[] = [];

    for (const file of files) {
      const relativePath = path.relative(this.baseDirectory, file);
      try {
        const result = await this.migrateFile(relativePath);
        results.push(result);

        if (result.rulesApplied.length > 0) {
          console.log(
            `🔄 Migrated ${relativePath}: ${result.reduction}% reduction`,
          );
        }
      } catch (error) {
        console.error(`❌ Error migrating ${relativePath}:`, error);
      }
    }

    return results;
  }

  // Générer un rapport de migration
  generateMigrationReport(results: MigrationResult[]): string {
    const totalFiles = results.length;
    const migratedFiles = results.filter(
      (r) => r.rulesApplied.length > 0,
    ).length;
    const totalOriginalSize = results.reduce(
      (sum, r) => sum + r.originalSize,
      0,
    );
    const totalNewSize = results.reduce((sum, r) => sum + r.newSize, 0);
    const totalReduction = Math.round(
      ((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100,
    );

    let report = "📊 Migration Report\n";
    report += "=====================================\n\n";
    report += `📁 Files processed: ${totalFiles}\n`;
    report += `✅ Files migrated: ${migratedFiles}\n`;
    report += `📉 Total size reduction: ${totalReduction}%\n`;
    report += `📏 Original size: ${(totalOriginalSize / 1024).toFixed(2)} KB\n`;
    report += `📏 New size: ${(totalNewSize / 1024).toFixed(2)} KB\n`;
    report += `💾 Space saved: ${((totalOriginalSize - totalNewSize) / 1024).toFixed(2)} KB\n\n`;

    // Règles appliquées
    const ruleStats = new Map<string, number>();
    for (const result of results) {
      for (const rule of result.rulesApplied) {
        ruleStats.set(rule, (ruleStats.get(rule) || 0) + 1);
      }
    }

    report += "🔧 Rules Applied:\n";
    for (const [rule, count] of ruleStats) {
      const ruleObj = this.rules.find((r) => r.id === rule);
      report += `   ${ruleObj?.name || rule}: ${count} files\n`;
    }

    // Top migrations par réduction
    const topMigrations = results
      .filter((r) => r.reduction > 0)
      .sort((a, b) => b.reduction - a.reduction)
      .slice(0, 10);

    if (topMigrations.length > 0) {
      report += "\n🏆 Top Optimizations:\n";
      for (const migration of topMigrations) {
        report += `   ${migration.file}: ${migration.reduction}% reduction\n`;
      }
    }

    return report;
  }

  // Méthodes utilitaires privées
  private async getFilesRecursively(
    dir: string,
    pattern: RegExp,
  ): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await this.getFilesRecursively(fullPath, pattern)));
      } else if (pattern.test(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private detectComponentType(
    content: string,
  ): ComponentAnalysis["componentType"] {
    if (/useReactTable|DataTable/i.test(content)) return "table";
    if (/useState.*form|onSubmit|FormData/i.test(content)) return "form";
    if (/jsPDF|react-pdf|\.pdf/i.test(content)) return "pdf";
    if (/Card|card\s*\{/i.test(content)) return "card";
    return "unknown";
  }

  private calculateComplexity(content: string): number {
    // Calculer la complexité cyclomatique simplifiée
    const complexity = (content.match(/if|for|while|case|catch|\?\s*:/g) || [])
      .length;
    return complexity;
  }

  private calculateMigrationPriority(
    content: string,
    type: ComponentAnalysis["componentType"],
    lineCount: number,
  ): ComponentAnalysis["migrationPriority"] {
    if (
      lineCount > 500 &&
      (type === "table" || type === "form" || type === "pdf")
    ) {
      return "high";
    }
    if (lineCount > 200 && type !== "unknown") {
      return "medium";
    }
    return "low";
  }

  private getRecommendedMigrations(content: string): string[] {
    const recommendations: string[] = [];

    if (/useReactTable|DataTable/i.test(content)) {
      recommendations.push("table-to-advanced");
    }
    if (/useState.*form|onSubmit/i.test(content)) {
      recommendations.push("form-to-advanced");
    }
    if (/jsPDF|react-pdf/i.test(content)) {
      recommendations.push("pdf-to-generic");
    }
    if (/console\./g.test(content)) {
      recommendations.push("remove-console-logs");
    }

    return recommendations;
  }

  private estimateEffort(
    complexity: number,
    lineCount: number,
  ): ComponentAnalysis["estimatedEffort"] {
    if (complexity > 20 || lineCount > 800) return "complex";
    if (complexity > 10 || lineCount > 300) return "medium";
    return "easy";
  }

  private detectCodeSmells(content: string): string[] {
    const smells: string[] = [];

    if ((content.match(/console\./g) || []).length > 5) {
      smells.push("Excessive console statements");
    }
    if ((content.match(/TODO|FIXME/g) || []).length > 3) {
      smells.push("Too many TODO comments");
    }
    if (content.length > 20000) {
      smells.push("File too large");
    }
    if ((content.match(/useState/g) || []).length > 10) {
      smells.push("Too many state variables");
    }
    if ((content.match(/useEffect/g) || []).length > 5) {
      smells.push("Too many effects");
    }

    return smells;
  }

  private detectDuplicatedCode(content: string): number {
    // Détecter le code dupliqué (implémentation simplifiée)
    const lines = content.split("\n").filter((line) => line.trim().length > 10);
    const duplicatedLines = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[i] === lines[j]) {
          duplicatedLines.add(lines[i]);
        }
      }
    }

    return Math.round((duplicatedLines.size / lines.length) * 100);
  }
}

// Hook React pour utiliser le système de migration
export function useMigrationAnalysis(files: string[]) {
  const [analyses, setAnalyses] = React.useState<ComponentAnalysis[]>([]);
  const [loading, setLoading] = React.useState(false);

  const analyzeFiles = React.useCallback(async () => {
    setLoading(true);
    try {
      const migrator = new AutoMigrator(process.cwd());
      const results = await Promise.all(
        files.map((file) => migrator.analyzeFile(file)),
      );
      setAnalyses(results);
    } catch (error) {
      console.error("Error analyzing files:", error);
    } finally {
      setLoading(false);
    }
  }, [files]);

  React.useEffect(() => {
    if (files.length > 0) {
      analyzeFiles();
    }
  }, [files, analyzeFiles]);

  return { analyses, loading, refresh: analyzeFiles };
}

import React from "react";

export default AutoMigrator;
