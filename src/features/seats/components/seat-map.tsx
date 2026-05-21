'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SeatData } from '../services/fetch-seats';
import { parseSeatNumber } from '../utils/parse-seat';
import { useRealtimeSeats } from '../hooks/use-realtime-seats';

// ─── Seat State Enum ───────────────────────────────────
type SeatState = 'available' | 'occupied' | 'selected';

// ─── Color Maps ────────────────────────────────────────
const seatColors: Record<SeatState, string> = {
  available:
    'bg-white border-gray-300 hover:border-gray-900 hover:bg-gray-50 cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-300',
  occupied:
    'bg-gray-200 border-gray-200 cursor-not-allowed opacity-40 dark:bg-gray-700 dark:border-gray-700',
  selected:
    'bg-gray-900 border-gray-900 text-white ring-2 ring-gray-400 ring-offset-2 cursor-pointer dark:bg-white dark:border-white dark:text-gray-900 dark:ring-gray-500',
};

const classAccents: Record<string, string> = {
  first: 'border-l-amber-400 dark:border-l-amber-500',
  business: 'border-l-blue-400 dark:border-l-blue-500',
  economy: '',
};

const classLabels: Record<string, { label: string; color: string }> = {
  first: {
    label: 'First Class',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  },
  business: {
    label: 'Business Class',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  },
  economy: {
    label: 'Economy Class',
    color:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  },
};

// ─── Format Price ──────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

// ─── Props ─────────────────────────────────────────────
interface SeatMapProps {
  flightId: string;
  initialSeats: SeatData[];
  basePrice: number;
  selectedSeatId: string | null;
  onSeatSelect: (seat: SeatData) => void;
}

// ─── Main Component ────────────────────────────────────
export function SeatMap({
  flightId,
  initialSeats,
  basePrice,
  selectedSeatId,
  onSeatSelect,
}: SeatMapProps) {
  // Local seat state for realtime updates
  const [seats, setSeats] = useState<SeatData[]>(initialSeats);

  // Handle realtime seat updates (optimistic)
  const handleSeatUpdate = useCallback((updated: SeatData) => {
    setSeats((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
    );
  }, []);

  // Subscribe to realtime
  useRealtimeSeats(flightId, handleSeatUpdate);

  // Group seats by class, then by row
  const { sections, columns } = useMemo(() => {
    const classOrder = ['first', 'business', 'economy'] as const;
    const allCols = new Set<string>();
    const grouped = new Map<string, Map<number, SeatData[]>>();

    // Initialize groups
    for (const cls of classOrder) {
      grouped.set(cls, new Map());
    }

    // Group seats
    for (const seat of seats) {
      const { row, col } = parseSeatNumber(seat.seat_number);
      if (!row || !col) continue;
      allCols.add(col);

      const classGroup = grouped.get(seat.class);
      if (classGroup) {
        const rowSeats = classGroup.get(row) || [];
        rowSeats.push(seat);
        classGroup.set(row, rowSeats);
      }
    }

    const sortedCols = Array.from(allCols).sort();

    const sectionData = classOrder
      .map((cls) => {
        const rowMap = grouped.get(cls)!;
        const sortedRows = Array.from(rowMap.keys()).sort((a, b) => a - b);
        return {
          class: cls,
          rows: sortedRows.map((rowNum) => ({
            rowNum,
            seats: rowMap.get(rowNum)!.sort((a, b) => {
              const colA = parseSeatNumber(a.seat_number).col;
              const colB = parseSeatNumber(b.seat_number).col;
              return colA.localeCompare(colB);
            }),
          })),
        };
      })
      .filter((s) => s.rows.length > 0);

    return { sections: sectionData, columns: sortedCols };
  }, [seats]);

  // Aisle position (between C and D for 6-col layout)
  const aisleAfter = 'C';

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded border border-gray-200 bg-gray-200 opacity-40 dark:border-gray-700 dark:bg-gray-700" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Occupied
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded border-2 border-gray-900 bg-gray-900 dark:border-white dark:bg-white" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Selected
          </span>
        </div>
        {Object.entries(classLabels).map(([cls, info]) => (
          <div key={cls} className="flex items-center gap-1.5">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${info.color}`}
            >
              {info.label}
            </span>
          </div>
        ))}
      </div>

      {/* Seat Grid — scrollable on mobile */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="min-w-[360px] p-4 sm:p-6">
          {/* Fuselage header */}
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-8 items-center gap-2 rounded-full bg-gray-100 px-4 dark:bg-gray-800">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Front of Aircraft
              </span>
            </div>
          </div>

          {/* Column headers */}
          <div className="mb-2 flex items-center justify-center gap-1">
            <div className="w-8" /> {/* Row number spacer */}
            {columns.map((col) => (
              <div
                key={col}
                className="flex items-center justify-center"
                style={{ width: 40 }}
              >
                {col === columns[Math.ceil(columns.length / 2)] ? (
                  <>
                    <span className="mr-3 text-xs font-bold text-gray-400 dark:text-gray-500">
                      {columns[Math.ceil(columns.length / 2) - 1]}
                    </span>
                    <div style={{ width: 20 }} />
                    <span className="ml-3 text-xs font-bold text-gray-400 dark:text-gray-500">
                      {col}
                    </span>
                  </>
                ) : col !== columns[Math.ceil(columns.length / 2) - 1] ? (
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                    {col}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          {/* Cabin sections */}
          {sections.map((section) => (
            <div key={section.class} className="mb-4">
              {/* Section label */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${classLabels[section.class]?.color ?? ''}`}
                >
                  {classLabels[section.class]?.label ?? section.class}
                </span>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              </div>

              {/* Rows */}
              {section.rows.map(({ rowNum, seats: rowSeats }) => (
                <div
                  key={rowNum}
                  className="mb-1 flex items-center justify-center gap-1"
                >
                  {/* Row number */}
                  <div className="flex w-8 items-center justify-center">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      {rowNum}
                    </span>
                  </div>

                  {/* Seat cells */}
                  {columns.map((col) => {
                    const seat = rowSeats.find(
                      (s) => parseSeatNumber(s.seat_number).col === col,
                    );

                    // Aisle gap
                    const showAisle =
                      col === columns[Math.ceil(columns.length / 2)];

                    return (
                      <div key={col} className="flex items-center">
                        {showAisle && <div style={{ width: 20 }} />}
                        {seat ? (
                          <button
                            id={`seat-${seat.seat_number}`}
                            type="button"
                            disabled={!seat.is_available}
                            onClick={() =>
                              seat.is_available && onSeatSelect(seat)
                            }
                            aria-label={
                              seat.is_available
                                ? `Seat ${seat.seat_number}, ${classLabels[seat.class]?.label ?? seat.class}, ${formatPrice(basePrice + seat.extra_fee)}`
                                : `Seat ${seat.seat_number} is occupied`
                            }
                            aria-pressed={selectedSeatId === seat.id}
                            className={`
                              flex h-9 w-9 items-center justify-center rounded-md border-2 text-xs font-medium
                              transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                              ${
                                selectedSeatId === seat.id
                                  ? seatColors.selected
                                  : seat.is_available
                                    ? seatColors.available
                                    : seatColors.occupied
                              }
                              ${classAccents[seat.class]}
                            `}
                            title={
                              seat.is_available
                                ? `${seat.seat_number} — ${classLabels[seat.class]?.label ?? seat.class} — ${formatPrice(basePrice + seat.extra_fee)}`
                                : `${seat.seat_number} — Occupied`
                            }
                          >
                            {seat.seat_number.replace(/^\d+/, '')}
                          </button>
                        ) : (
                          // Empty placeholder for missing seats (e.g., first class rows)
                          <div className="h-9 w-9" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

          {/* Tail */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex h-8 items-center gap-2 rounded-full bg-gray-100 px-4 dark:bg-gray-800">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Rear of Aircraft
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected seat info */}
      {selectedSeatId && (
        <div className="rounded-xl border border-gray-900/20 bg-gray-900 p-4 text-white dark:border-white/20 dark:bg-white dark:text-gray-900">
          {(() => {
            const seat = seats.find((s) => s.id === selectedSeatId);
            if (!seat) return null;
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm font-bold dark:bg-gray-900/10">
                    {seat.seat_number}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Seat {seat.seat_number} · {classLabels[seat.class]?.label ?? seat.class}
                    </p>
                    <p className="text-xs opacity-70">
                      Extra fee: {formatPrice(seat.extra_fee)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">Total</p>
                  <p className="text-lg font-bold">
                    {formatPrice(basePrice + seat.extra_fee)}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
