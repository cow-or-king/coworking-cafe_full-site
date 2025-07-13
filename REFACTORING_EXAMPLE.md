// Exemple d'utilisation des nouveaux composants réutilisables dans la page Cash Control

import { CashEntryForm } from "@/components/dashboard/accounting/cash-control/CashEntryForm";
import { DataTable } from "@/components/dashboard/accounting/cash-control/data-table";
import { columns } from "@/components/dashboard/accounting/cash-control/columns";
import { AmountDisplay, DateDisplay, LabelAmountList } from "@/components/ui/data-display";
import { StatGrid, StatCard, useTrend } from "@/components/ui/stat-cards";
import { useCashEntryDataFixed } from "@/hooks/use-cash-entry-data-fixed";
import { useChartData } from "@/hooks/use-chart-data-fixed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function CashControlOptimized() {
// Utiliser nos caches optimisés
const { data: turnoverData } = useChartData();
const { dataCash, refetch: refetchCashEntries } = useCashEntryDataFixed();

// États locaux simplifiés
const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());

// Calculs des totaux pour les statistiques
const totals = useMemo(() => {
if (!dataCash || dataCash.length === 0) {
return {
totalTTC: 0,
totalHT: 0,
totalVirement: 0,
totalEspeces: 0,
totalCB: 0,
};
}

    return dataCash.reduce((acc, row) => {
      acc.totalTTC += Number(row.TTC) || 0;
      acc.totalHT += Number(row.HT) || 0;
      acc.totalVirement += Number(row.virement) || 0;
      acc.totalEspeces += Number(row.especes) || 0;
      acc.totalCB += (Number(row.cbClassique) || 0) + (Number(row.cbSansContact) || 0);
      return acc;
    }, {
      totalTTC: 0,
      totalHT: 0,
      totalVirement: 0,
      totalEspeces: 0,
      totalCB: 0,
    });

}, [dataCash]);

// Statistiques pour les cartes
const stats = [
{
title: "Total TTC",
value: totals.totalTTC,
description: "Chiffre d'affaires total",
variant: "success" as const,
},
{
title: "Total HT",
value: totals.totalHT,
description: "Montant hors taxes",
variant: "default" as const,
},
{
title: "Virements",
value: totals.totalVirement,
description: "Paiements par virement",
variant: "default" as const,
},
{
title: "Espèces + CB",
value: totals.totalEspeces + totals.totalCB,
description: "Paiements en liquide et carte",
variant: "default" as const,
},
];

// Gestionnaire de soumission du formulaire
const handleFormSubmit = async (formData: any) => {
try {
// Préparer les données pour l'API
const dateToSend = new Date(formData.date).toISOString();

      const bodyData = {
        date: dateToSend,
        prestaB2B: formData.prestaB2B
          .filter((p: any) => p.label && p.value !== "" && !isNaN(Number(p.value)))
          .map((p: any) => ({
            label: p.label,
            value: Number(p.value),
          })),
        depenses: formData.depenses
          .filter((d: any) => d.label && d.value !== "" && !isNaN(Number(d.value)))
          .map((d: any) => ({
            label: d.label,
            value: Number(d.value),
          })),
        virement: formData.virement !== "" ? Number(formData.virement) : 0,
        especes: formData.especes !== "" ? Number(formData.especes) : 0,
        cbClassique: formData.cbClassique !== "" ? Number(formData.cbClassique) : 0,
        cbSansContact: formData.cbSansContact !== "" ? Number(formData.cbSansContact) : 0,
      };

      // Envoyer à l'API
      const response = await fetch("/api/cash-entry/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        toast.success("Entrée de caisse créée avec succès !");
        refetchCashEntries();
      } else {
        throw new Error("Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'entrée");
      console.error("Erreur:", error);
    }

};

return (
<div className="space-y-6 p-6">
{/_ En-tête avec statistiques _/}
<div className="space-y-4">
<h1 className="text-3xl font-bold">Contrôle de Caisse</h1>
<StatGrid stats={stats} columns={4} />
</div>

      {/* Formulaire de création */}
      <CashEntryForm
        onSubmit={handleFormSubmit}
      />

      {/* Tableau des données */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Entrées</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={dataCash || []}
          />
        </CardContent>
      </Card>

      {/* Résumé des totaux */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé Financier</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Revenus</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>TTC:</span>
                <AmountDisplay amount={totals.totalTTC} variant="positive" />
              </div>
              <div className="flex justify-between">
                <span>HT:</span>
                <AmountDisplay amount={totals.totalHT} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Moyens de Paiement</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Virements:</span>
                <AmountDisplay amount={totals.totalVirement} />
              </div>
              <div className="flex justify-between">
                <span>Espèces:</span>
                <AmountDisplay amount={totals.totalEspeces} />
              </div>
              <div className="flex justify-between">
                <span>CB Total:</span>
                <AmountDisplay amount={totals.totalCB} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Période</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Année:</span>
                <span>{selectedYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Mois:</span>
                <span>{selectedMonth !== null ? selectedMonth + 1 : "Tous"}</span>
              </div>
              <div className="flex justify-between">
                <span>Entrées:</span>
                <span>{dataCash?.length || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

);
}

/\*
AVANTAGES DE CETTE REFACTORISATION :

✅ COMPOSANTS RÉUTILISABLES :

- CashEntryForm : Formulaire modulaire réutilisable
- FormComponents : Inputs spécialisés pour prestaB2B/dépenses
- StatGrid/StatCard : Cartes de statistiques configurables
- data-display : Composants d'affichage formaté (montants, dates, listes)
- NumericKeypad : Clavier numérique réutilisable
- use-form : Hook personnalisé pour la gestion des formulaires

✅ SÉPARATION DES RESPONSABILITÉS :

- Logique métier séparée de l'affichage
- Composants focalisés sur une seule responsabilité
- Hooks personnalisés pour la logique réutilisable

✅ MAINTENABILITÉ :

- Code plus facile à tester (composants isolés)
- Modifications localisées (un composant = une fonctionnalité)
- Types TypeScript partagés pour la cohérence

✅ PERFORMANCE :

- Composants plus petits = re-render plus efficace
- Memoization plus granulaire possible
- Lazy loading facilité par la modularité

✅ RÉUTILISABILITÉ :

- Composants utilisables dans d'autres pages
- Styles et comportements cohérents
- Configuration par props pour l'adaptabilité

PROCHAINES ÉTAPES RECOMMANDÉES :

1. Appliquer le même pattern aux autres pages volumineuses
2. Créer des composants de layout partagés
3. Développer une bibliothèque de composants métier
4. Implémenter des tests unitaires sur les composants isolés
   \*/
