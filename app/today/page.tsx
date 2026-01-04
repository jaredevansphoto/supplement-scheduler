"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Supplement {
  id: string;
  name: string;
  servingSize: string | null;
  cycleRule: string | null;
}

interface Schedule {
  id: string;
  time: string;
  dose: string;
  withFood: boolean;
  notes: string | null;
  supplement: Supplement;
}

interface Intake {
  id: string;
  supplementId: string;
  status: string;
  date: string;
}

const TIME_ORDER = [
  "Upon waking",
  "30 min pre-workout",
  "With breakfast",
  "With lunch",
  "With dinner",
  "Before bed",
];

export default function TodayPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [scheduleRes, intakeRes] = await Promise.all([
        fetch("/api/schedule"),
        fetch(`/api/intake?date=${today}`),
      ]);

      if (scheduleRes.ok) {
        setSchedules(await scheduleRes.json());
      }
      if (intakeRes.ok) {
        setIntakes(await intakeRes.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logIntake = async (supplementId: string, intakeStatus: string) => {
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplementId,
          date: new Date().toISOString(),
          status: intakeStatus,
        }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error logging intake:", error);
    }
  };

  const getIntakeStatus = (supplementId: string) => {
    const intake = intakes.find((i) => i.supplementId === supplementId);
    return intake?.status;
  };

  const groupByTime = (items: Schedule[]) => {
    const groups: Record<string, Schedule[]> = {};
    items.forEach((item) => {
      const time = item.time || "Other";
      if (!groups[time]) groups[time] = [];
      groups[time].push(item);
    });
    return groups;
  };

  const sortTimes = (times: string[]) => {
    return times.sort((a, b) => {
      const aIndex = TIME_ORDER.indexOf(a);
      const bIndex = TIME_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Today&apos;s Schedule</h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const groupedSchedules = groupByTime(schedules);
  const sortedTimes = sortTimes(Object.keys(groupedSchedules));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Today&apos;s Schedule</h1>
          <p className="text-sm text-gray-500">Welcome, {session.user?.name || session.user?.email}</p>
        </div>
        <p className="text-gray-500">{today}</p>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No supplements scheduled yet.</p>
          <p className="text-sm mt-2">Your supplements have been loaded from the seed data.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedTimes.map((time) => (
            <div key={time} className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">{time}</h2>
              <div className="space-y-3">
                {groupedSchedules[time].map((schedule) => {
                  const currentStatus = getIntakeStatus(schedule.supplement.id);
                  return (
                    <div
                      key={schedule.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        currentStatus === "taken"
                          ? "bg-green-50 border border-green-200"
                          : currentStatus === "skipped"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{schedule.supplement.name}</p>
                        <p className="text-sm text-gray-500">
                          {schedule.dose}
                          {schedule.withFood && " • With food"}
                          {schedule.notes && ` • ${schedule.notes}`}
                        </p>
                        {schedule.supplement.cycleRule && (
                          <p className="text-xs text-orange-600 mt-1">
                            Cycle: {schedule.supplement.cycleRule}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => logIntake(schedule.supplement.id, "taken")}
                          className={`px-3 py-1 rounded text-sm ${
                            currentStatus === "taken"
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          Taken
                        </button>
                        <button
                          onClick={() => logIntake(schedule.supplement.id, "skipped")}
                          className={`px-3 py-1 rounded text-sm ${
                            currentStatus === "skipped"
                              ? "bg-yellow-600 text-white"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          }`}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
