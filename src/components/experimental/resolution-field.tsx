"use client";

import * as React from "react";
import { Lock, LockOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Resolution } from "@/types/core/Resolution";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

const MAX_DIMENSION = 15360; // 16K
const FRAME = { width: 3840, height: 2160 }; // preview frame = 4K

const PRESETS = [
  { label: "HD", width: 1280, height: 720 },
  { label: "Full HD", width: 1920, height: 1080 },
  { label: "QHD", width: 2560, height: 1440 },
  { label: "4K", width: 3840, height: 2160 },
] as const;

const KNOWN_RATIOS: [string, number][] = [
  ["1:1", 1],
  ["4:3", 4 / 3],
  ["3:2", 3 / 2],
  ["16:10", 16 / 10],
  ["16:9", 16 / 9],
  ["21:9", 21 / 9],
  ["32:9", 32 / 9],
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function parseDimension(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  return Math.min(parseInt(digits, 10), MAX_DIMENSION);
}

function describeRatio(width: number, height: number): string {
  const ratio = width / height;
  const match = KNOWN_RATIOS.find(([, r]) => Math.abs(r - ratio) / r < 0.015);
  return match ? match[0] : `${ratio.toFixed(2)}:1`;
}

function describe(value: Resolution | null): string {
  if (!value?.width && !value?.height) return "Any size";
  if (value?.width && !value?.height)
    return `Width at least ${value?.width.toLocaleString()} px`;
  if (!value?.width && value?.height)
    return `Height at least ${value?.height.toLocaleString()} px`;
  const mp = (value?.width! * value?.height!) / 1_000_000;
  return `${value?.width!.toLocaleString()} × ${value?.height!.toLocaleString()} px · ${mp.toFixed(
    mp < 10 ? 1 : 0,
  )} MP · ${describeRatio(value?.width!, value?.height!)}`;
}

/* -------------------------------------------------------------------------- */
/*  Preview: the chosen minimum, drawn to scale inside a 4K frame              */
/* -------------------------------------------------------------------------- */

function ResolutionPreview({ value }: { value: Resolution | null }) {
  const pct = (value: number | undefined, max: number) =>
    value ? Math.min((value / max) * 100, 100) : 0;

  const w = value?.width ? pct(value?.width, FRAME.width) : 100;
  const h = value?.height ? pct(value?.height, FRAME.height) : 100;
  const hasValue = Boolean(value?.width || value?.height);

  return (
    <div
      aria-hidden="true"
      className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted/40"
    >
      {/* Ghost outlines for common sizes, so the scale is easy to read */}
      {PRESETS.slice(0, -1).map((p) => (
        <div
          key={p.label}
          className="absolute left-0 top-0 rounded-br-sm border-b border-r border-dashed border-border"
          style={{
            width: `${pct(p.width, FRAME.width)}%`,
            height: `${pct(p.height, FRAME.height)}%`,
          }}
        >
          <span className="absolute bottom-0.5 right-1 text-[10px] leading-none text-muted-foreground/70">
            {p.label}
          </span>
        </div>
      ))}

      {/* The selected minimum */}
      <div
        className={cn(
          "absolute left-0 top-0 rounded-br-sm border-b-2 border-r-2 border-primary bg-primary/15 transition-[width,height,opacity] duration-300 ease-out motion-reduce:transition-none",
          !hasValue && "opacity-0",
        )}
        style={{ width: `${w}%`, height: `${h}%` }}
      />

      {!hasValue && (
        <span className="absolute inset-0 flex items-end justify-center text-xs text-muted-foreground">
          No minimum set
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field                                                                      */
/* -------------------------------------------------------------------------- */

export interface ResolutionFieldProps {
  value: Resolution | null;
  onChange: (value: Resolution | null) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function ResolutionField({
  value,
  onChange,
  label = "Minimum resolution",
  description = "Images smaller than this won’t appear in results.",
  disabled,
  className,
}: ResolutionFieldProps) {
  const id = React.useId();
  const [locked, setLocked] = React.useState(false);
  const ratioRef = React.useRef<number | null>(null);

  const canLock = Boolean(value?.width && value.height);
  const hasValue = Boolean(value?.width || value?.height);

  function toggleLock() {
    if (!locked && value?.width && value.height) {
      ratioRef.current = value?.width / value.height;
    }
    setLocked((prev) => !prev);
  }

  function setWidth(width: number | undefined) {
    if (locked && ratioRef.current && width) {
      onChange({ width, height: Math.round(width / ratioRef.current) });
    } else {
      onChange({ ...value, width });
    }
  }

  function setHeight(height: number | undefined) {
    if (locked && ratioRef.current && height) {
      onChange({ width: Math.round(height * ratioRef.current), height });
    } else {
      onChange({ ...value, height });
    }
  }

  function applyPreset(width: number, height: number) {
    if (locked) ratioRef.current = width / height;
    onChange({ width, height });
  }

  function stepOnArrow(
    e: React.KeyboardEvent<HTMLInputElement>,
    current: number | undefined,
    set: (n: number | undefined) => void,
  ) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const step = e.shiftKey ? 100 : 10;
    const next = (current ?? 0) + (e.key === "ArrowUp" ? step : -step);
    set(next <= 0 ? undefined : Math.min(next, MAX_DIMENSION));
  }

  return (
    <Field
      role="group"
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-description`}
      className={cn("grid gap-3", className)}
      orientation={"vertical"}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="grid gap-1">
          <FieldLabel id={`${id}-label`} htmlFor={`${id}-width`}>
            {label}
          </FieldLabel>
          <FieldDescription id={`${id}-description`}>
            {description}
          </FieldDescription>
        </div>
        {hasValue && (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Presets">
        {PRESETS.map((p) => {
          const active = value?.width === p.width && value?.height === p.height;
          return (
            <Button
              key={p.label}
              type="button"
              // size="sm"
              variant={active ? "secondary" : "outline"}
              aria-pressed={active}
              disabled={disabled}
              onClick={() => applyPreset(p.width, p.height)}
              // className={cn("h-8 gap-1.5", active && "border-primary/60")}
            >
              {p.label}
              <span className="text-xs font-normal text-muted-foreground">
                {p.height}p
              </span>
            </Button>
          );
        })}
      </div>

      {/* Width × Height */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            id={`${id}-width`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Any"
            aria-label="Minimum width in pixels"
            disabled={disabled}
            value={value?.width ?? ""}
            onChange={(e) => setWidth(parseDimension(e.target.value))}
            onKeyDown={(e) => stepOnArrow(e, value?.width, setWidth)}
            className="pr-9 tabular-nums"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            px
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled || (!canLock && !locked)}
          aria-pressed={locked}
          aria-label={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
          title={
            canLock || locked
              ? locked
                ? "Aspect ratio locked"
                : "Lock aspect ratio"
              : "Enter both values to lock the aspect ratio"
          }
          onClick={toggleLock}
        >
          {locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <LockOpen className="h-4 w-4" />
          )}
        </Button>

        <div className="relative flex-1">
          <Input
            id={`${id}-height`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Any"
            aria-label="Minimum height in pixels"
            disabled={disabled}
            value={value?.height ?? ""}
            onChange={(e) => setHeight(parseDimension(e.target.value))}
            onKeyDown={(e) => stepOnArrow(e, value?.height, setHeight)}
            className="pr-9 tabular-nums"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            px
          </span>
        </div>
      </div>

      {/* Scale preview + readout */}
      <ResolutionPreview value={value} />
      <p
        className="text-sm tabular-nums text-muted-foreground"
        aria-live="polite"
      >
        {describe(value)}
      </p>
    </Field>
  );
}

/* -------------------------------------------------------------------------- */
/*  Usage with react-hook-form + shadcn <Form>                                 */
/* -------------------------------------------------------------------------- */
/*
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { ResolutionField } from "@/components/resolution-field"

const form = useForm<{ minResolution: Resolution }>({
  defaultValues: { minResolution: {} },
})

<Form {...form}>
  <FormField
    control={form.control}
    name="minResolution"
    render={({ field }) => (
      <FormItem>
        <ResolutionField value={field.value} onChange={field.onChange} />
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
*/
