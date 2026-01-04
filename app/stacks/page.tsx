"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Ingredient {
  id: string;
  name: string;
  rda: string | null;
  ul: string | null;
  units: string | null;
  notes: string | null;
}

interface SupplementIngredient {
  id: string;
  dose: string;
  ingredient: Ingredient;
}

interface Supplement {
  id: string;
  name: string;
  servingSize: string | null;
  cycleRule: string | null;
  notes: string | null;
  ingredients: SupplementIngredient[];
}

export default function StacksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchSupplements();
    }
  }, [session]);

  const fetchSupplements = async () => {
    try {
      const res = await fetch("/api/supplements");
      if (res.ok) {
        setSupplements(await res.json());
      }
    } catch (error) {
      console.error("Error fetching supplements:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedSupplement(expandedSupplement === id ? null : id);
  };

  if (status === "loading" || loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Supplement Catalog</h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Supplement Catalog</h1>
          <p className="text-sm text-gray-500">
            {supplements.length} supplements loaded
          </p>
        </div>
        <Link href="/today" className="text-blue-600 hover:underline">
          View Today&apos;s Schedule
        </Link>
      </div>

      {supplements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No supplements in the catalog yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {supplements.map((supplement) => (
            <div key={supplement.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded(supplement.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left"
              >
                <div>
                  <h3 className="font-medium">{supplement.name}</h3>
                  <p className="text-sm text-gray-500">
                    {supplement.servingSize || "No serving size specified"}
                    {supplement.cycleRule && (
                      <span className="ml-2 text-orange-600">
                        • Cycle: {supplement.cycleRule}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {supplement.ingredients.length} ingredients
                  </span>
                  <span className="text-gray-400">
                    {expandedSupplement === supplement.id ? "▼" : "▶"}
                  </span>
                </div>
              </button>

              {expandedSupplement === supplement.id && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                  <h4 className="font-medium py-2 text-sm text-gray-600">Ingredients:</h4>
                  {supplement.ingredients.length === 0 ? (
                    <p className="text-sm text-gray-400">No ingredients listed</p>
                  ) : (
                    <div className="space-y-2">
                      {supplement.ingredients.map((si) => (
                        <div
                          key={si.id}
                          className="flex justify-between items-start p-2 bg-white rounded border"
                        >
                          <div>
                            <p className="font-medium text-sm">{si.ingredient.name}</p>
                            <p className="text-xs text-gray-500">
                              Dose: {si.dose}
                              {si.ingredient.units && ` (${si.ingredient.units})`}
                            </p>
                          </div>
                          <div className="text-right text-xs">
                            {si.ingredient.rda && (
                              <p className="text-green-600">RDA: {si.ingredient.rda}</p>
                            )}
                            {si.ingredient.ul && (
                              <p className="text-red-600">UL: {si.ingredient.ul}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {supplement.notes && (
                    <p className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {supplement.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
