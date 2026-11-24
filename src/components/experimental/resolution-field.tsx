"use client"

/**
 * ResolutionField — pick a minimum resolution (width × height) for filtering images.
 *
 * Value contract
 *   - `null`                              → no minimum
 *   - `{ width: number, height: number }` → both always present; an unset side is `0`
 *     (0 means "no minimum on this side"). If both sides become 0 the value is `null`.
 *
 * Architecture: a Radix-style compound component. `ResolutionField` is the root and owns
 * the state; every other export is an independent part that reads it from context.
 * Use the root alone for the default layout, or compose / replace parts yourself.
 *
 * Requires: shadcn `button`, `input`, `label`; `lucide-react`; `@/lib/utils` (cn).
 * Ref forwarding on the parts needs React 19 (or add forwardRef wrappers on React 18).
 */

import * as React from "react"
import { Lock, LockOpen, Monitor, Smartphone, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* -------------------------------------------------------------------------- */
/*  Types & constants                                                          */
/* -------------------------------------------------------------------------- */

export type Resolution = { width: number; height: number }
export type Orientation = "landscape" | "portrait"
/** Presets are always declared in landscape; they are flipped when portrait is active. */
export type ResolutionPreset = { label: string; width: number; height: number }

export const DEFAULT_PRESETS: ResolutionPreset[] = [
  { label: "HD", width: 1280, height: 720 },
  { label: "Full HD", width: 1920, height: 1080 },
  { label: "QHD", width: 2560, height: 1440 },
  { label: "4K", width: 3840, height: 2160 },
]

const DEFAULT_FRAME = { width: 3840, height: 2160 }
const DEFAULT_MAX = 15360 // 16K

const KNOWN_RATIOS: [string, number][] = [
  ["1:1", 1],
  ["4:3", 4 / 3],
  ["3:2", 3 / 2],
  ["16:10", 16 / 10],
  ["16:9", 16 / 9],
  ["21:9", 21 / 9],
  ["32:9", 32 / 9],
]

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function aspectRatioLabel(width: number, height: number): string {
  const long = Math.max(width, height)
  const short = Math.min(width, height)
  const r = long / short
  const known = KNOWN_RATIOS.find(([, k]) => Math.abs(k - r) / k < 0.015)
  const label = known ? known[0] : `${r.toFixed(2)}:1`
  // Present as width:height, so portrait reads 9:16
  return height > width ? label.split(":").reverse().join(":") : label
}

/** Default text for the readout. Exported so you can reuse or wrap it. */
export function formatResolution(value: Resolution | null): string {
  if (!value) return "Any size"
  const { width, height } = value
  if (!height) return `Width at least ${width.toLocaleString()} px · any height`
  if (!width) return `Height at least ${height.toLocaleString()} px · any width`
  const mp = (width * height) / 1_000_000
  return [
    `${width.toLocaleString()} × ${height.toLocaleString()} px`,
    `${mp.toFixed(mp < 10 ? 1 : 0)} MP`,
    aspectRatioLabel(width, height),
    height > width ? "Portrait" : "Landscape",
  ].join(" · ")
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface ResolutionFieldContextValue {
  value: Resolution | null
  width: number
  height: number
  max: number
  disabled: boolean
  hasValue: boolean
  orientation: Orientation
  portrait: boolean
  locked: boolean
  canLock: boolean
  ids: { label: string; description: string; width: string; height: string }
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  setOrientation: (orientation: Orientation) => void
  toggleLock: () => void
  applyPreset: (preset: ResolutionPreset) => void
  clear: () => void
}

const ResolutionFieldContext =
  React.createContext<ResolutionFieldContextValue | null>(null)

/** Access field state from your own custom parts. */
export function useResolutionField() {
  const ctx = React.useContext(ResolutionFieldContext)
  if (!ctx) {
    throw new Error("ResolutionField parts must be used inside <ResolutionField>")
  }
  return ctx
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

export interface ResolutionFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /** Controlled value. Use `null` for "no minimum". */
  value?: Resolution | null
  /** Initial value when uncontrolled. */
  defaultValue?: Resolution | null
  onChange?: (value: Resolution | null) => void
  disabled?: boolean
  /** Largest accepted dimension in px. */
  max?: number
}

function ResolutionField({
  value: valueProp,
  defaultValue = null,
  onChange,
  disabled = false,
  max = DEFAULT_MAX,
  className,
  children,
  ...props
}: ResolutionFieldProps) {
  const baseId = React.useId()
  const ids = React.useMemo(
    () => ({
      label: `${baseId}-label`,
      description: `${baseId}-description`,
      width: `${baseId}-width`,
      height: `${baseId}-height`,
    }),
    [baseId]
  )

  const [inner, setInner] = React.useState<Resolution | null>(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : inner
  const width = value?.width ?? 0
  const height = value?.height ?? 0
  const hasValue = width > 0 || height > 0
  const canLock = width > 0 && height > 0

  const [orientationPref, setOrientationPref] =
    React.useState<Orientation>("landscape")
  const [lockRequested, setLockRequested] = React.useState(false)
  const ratioRef = React.useRef<number | null>(null)

  // Orientation follows the values when both are set; otherwise the toggle decides.
  const orientation: Orientation = canLock
    ? height > width
      ? "portrait"
      : "landscape"
    : orientationPref
  const portrait = orientation === "portrait"

  // The lock only makes sense while both sides have a value.
  React.useEffect(() => {
    if (lockRequested && !canLock) setLockRequested(false)
  }, [lockRequested, canLock])
  const locked = lockRequested && canLock

  const clamp = React.useCallback(
    (n: number) => Math.max(0, Math.min(Math.round(n) || 0, max)),
    [max]
  )

  const commit = React.useCallback(
    (w: number, h: number) => {
      // Both fields are always present; both zero collapses to null.
      const next = w > 0 || h > 0 ? { width: w, height: h } : null
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )

  const setWidth = (raw: number) => {
    const w = clamp(raw)
    if (locked && ratioRef.current && w > 0) {
      commit(w, clamp(w / ratioRef.current))
    } else {
      commit(w, height)
    }
  }

  const setHeight = (raw: number) => {
    const h = clamp(raw)
    if (locked && ratioRef.current && h > 0) {
      commit(clamp(h * ratioRef.current), h)
    } else {
      commit(width, h)
    }
  }

  const setOrientation = (next: Orientation) => {
    setOrientationPref(next)
    if (next === orientation) return
    if (hasValue) commit(height, width)
    if (ratioRef.current) ratioRef.current = 1 / ratioRef.current
  }

  const toggleLock = () => {
    if (!locked && canLock) ratioRef.current = width / height
    setLockRequested(!locked)
  }

  const applyPreset = (preset: ResolutionPreset) => {
    const w = portrait ? preset.height : preset.width
    const h = portrait ? preset.width : preset.height
    if (locked) ratioRef.current = w / h
    commit(w, h)
  }

  const clear = () => {
    setOrientationPref(orientation) // keep the orientation the user was in
    setLockRequested(false)
    commit(0, 0)
  }

  const ctx: ResolutionFieldContextValue = {
    value,
    width,
    height,
    max,
    disabled,
    hasValue,
    orientation,
    portrait,
    locked,
    canLock,
    ids,
    setWidth,
    setHeight,
    setOrientation,
    toggleLock,
    applyPreset,
    clear,
  }

  return (
    <ResolutionFieldContext.Provider value={ctx}>
      <div
        data-slot="resolution-field"
        role="group"
        aria-labelledby={ids.label}
        aria-describedby={ids.description}
        className={cn("grid gap-3", className)}
        {...props}
      >
        {children ?? <ResolutionFieldDefaultLayout />}
      </div>
    </ResolutionFieldContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Text parts                                                                 */
/* -------------------------------------------------------------------------- */

function ResolutionFieldHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resolution-field-header"
      className={cn("flex items-start justify-between gap-2", className)}
      {...props}
    />
  )
}

function ResolutionFieldLabel({
  children = "Minimum resolution",
  ...props
}: React.ComponentProps<typeof Label>) {
  const { ids } = useResolutionField()
  return (
    <Label
      data-slot="resolution-field-label"
      id={ids.label}
      htmlFor={ids.width}
      {...props}
    >
      {children}
    </Label>
  )
}

function ResolutionFieldDescription({
  className,
  children = "Images smaller than this won’t appear in results.",
  ...props
}: React.ComponentProps<"p">) {
  const { ids } = useResolutionField()
  return (
    <p
      data-slot="resolution-field-description"
      id={ids.description}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function ResolutionFieldReadout({
  className,
  format = formatResolution,
  children,
  ...props
}: Omit<React.ComponentProps<"p">, "children"> & {
  /** Customise the text. */
  format?: (value: Resolution | null) => React.ReactNode
  children?: React.ReactNode
}) {
  const { value } = useResolutionField()
  return (
    <p
      data-slot="resolution-field-readout"
      aria-live="polite"
      className={cn("text-sm tabular-nums text-muted-foreground", className)}
      {...props}
    >
      {children ?? format(value)}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/*  Clear                                                                      */
/* -------------------------------------------------------------------------- */

function ResolutionFieldClear({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { hasValue, disabled, clear } = useResolutionField()
  if (!hasValue) return null
  return (
    <Button
      data-slot="resolution-field-clear"
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={clear}
      className={cn("-mr-2 h-7 px-2 text-muted-foreground", className)}
      {...props}
    >
      {children ?? (
        <>
          <X className="mr-1 h-3.5 w-3.5" />
          Clear
        </>
      )}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Orientation                                                                */
/* -------------------------------------------------------------------------- */

function ResolutionFieldOrientation({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resolution-field-orientation"
      role="group"
      aria-label="Orientation"
      className={cn(
        "inline-flex w-fit gap-0.5 rounded-lg bg-muted p-[3px]",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <ResolutionFieldOrientationItem orientation="landscape" />
          <ResolutionFieldOrientationItem orientation="portrait" />
        </>
      )}
    </div>
  )
}

function ResolutionFieldOrientationItem({
  orientation,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { orientation: Orientation }) {
  const ctx = useResolutionField()
  const active = ctx.orientation === orientation
  const Icon = orientation === "portrait" ? Smartphone : Monitor
  return (
    <Button
      data-slot="resolution-field-orientation-item"
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={active}
      disabled={ctx.disabled}
      onClick={() => ctx.setOrientation(orientation)}
      className={cn(
        "h-7 gap-1.5 px-2.5 text-muted-foreground",
        "aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm aria-pressed:hover:bg-background",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <Icon className="h-4 w-4" />
          {orientation === "portrait" ? "Portrait" : "Landscape"}
        </>
      )}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Presets                                                                    */
/* -------------------------------------------------------------------------- */

function ResolutionFieldPresets({
  presets = DEFAULT_PRESETS,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { presets?: ResolutionPreset[] }) {
  return (
    <div
      data-slot="resolution-field-presets"
      role="group"
      aria-label="Presets"
      className={cn("flex flex-wrap gap-1.5", className)}
      {...props}
    >
      {children ??
        presets.map((preset) => (
          <ResolutionFieldPreset key={preset.label} preset={preset} />
        ))}
    </div>
  )
}

function ResolutionFieldPreset({
  preset,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { preset: ResolutionPreset }) {
  const ctx = useResolutionField()
  const w = ctx.portrait ? preset.height : preset.width
  const h = ctx.portrait ? preset.width : preset.height
  const active = ctx.width === w && ctx.height === h
  return (
    <Button
      data-slot="resolution-field-preset"
      type="button"
      size="sm"
      variant="outline"
      aria-pressed={active}
      disabled={ctx.disabled}
      onClick={() => ctx.applyPreset(preset)}
      className={cn(
        "h-8 gap-1.5 aria-pressed:border-primary/60 aria-pressed:bg-secondary",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {preset.label}
          <span className="text-xs font-normal text-muted-foreground">
            {Math.min(preset.width, preset.height)}p
          </span>
        </>
      )}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Inputs                                                                     */
/* -------------------------------------------------------------------------- */

function ResolutionFieldInputs({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resolution-field-inputs"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children ?? (
        <>
          <ResolutionFieldWidth />
          <ResolutionFieldLock />
          <ResolutionFieldHeight />
        </>
      )}
    </div>
  )
}

type DimensionInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type"
> & { unit?: React.ReactNode }

function DimensionInput({
  dimension,
  unit = "px",
  className,
  ...props
}: DimensionInputProps & { dimension: "width" | "height" }) {
  const ctx = useResolutionField()
  const current = dimension === "width" ? ctx.width : ctx.height
  const set = dimension === "width" ? ctx.setWidth : ctx.setHeight

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
    e.preventDefault()
    const step = e.shiftKey ? 100 : 10
    set(current + (e.key === "ArrowUp" ? step : -step))
  }

  return (
    <div className="relative min-w-0 flex-1">
      <Input
        data-slot={`resolution-field-${dimension}`}
        id={ctx.ids[dimension]}
        inputMode="numeric"
        autoComplete="off"
        placeholder="Any"
        aria-label={`Minimum ${dimension} in pixels`}
        disabled={ctx.disabled}
        // 0 means "no minimum", so it is shown as empty (placeholder "Any")
        value={current > 0 ? String(current) : ""}
        onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)}
        onKeyDown={onKeyDown}
        className={cn("pr-9 tabular-nums", className)}
        {...props}
      />
      {unit && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      )}
    </div>
  )
}

function ResolutionFieldWidth(props: DimensionInputProps) {
  return <DimensionInput dimension="width" {...props} />
}

function ResolutionFieldHeight(props: DimensionInputProps) {
  return <DimensionInput dimension="height" {...props} />
}

function ResolutionFieldLock({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { locked, canLock, disabled, toggleLock } = useResolutionField()
  return (
    <Button
      data-slot="resolution-field-lock"
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={locked}
      aria-label={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
      title={
        canLock
          ? locked
            ? "Aspect ratio locked"
            : "Lock aspect ratio"
          : "Enter both values to lock the aspect ratio"
      }
      disabled={disabled || !canLock}
      onClick={toggleLock}
      className={cn("h-9 w-9 shrink-0", locked && "text-primary", className)}
      {...props}
    >
      {children ??
        (locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />)}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Preview                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Draws the minimum to scale inside a reference frame (4K by default).
 *
 * The stage has a fixed size in both orientations; only the frame’s width animates when
 * switching orientation. Height never changes, so the layout can’t jump or flash a
 * scrollbar.
 */
function ResolutionFieldPreview({
  frame = DEFAULT_FRAME,
  presets = DEFAULT_PRESETS,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  frame?: { width: number; height: number }
  /** Presets drawn as dashed guide outlines (only those smaller than `frame`). */
  presets?: ResolutionPreset[]
}) {
  const { width, height, portrait, hasValue } = useResolutionField()

  const F = portrait
    ? { width: frame.height, height: frame.width }
    : { width: frame.width, height: frame.height }
  const pct = (v: number, of: number) => Math.min((v / of) * 100, 100)

  // Portrait frame width, as a share of the (landscape-shaped) stage.
  const portraitWidth = (frame.height / frame.width) ** 2 * 100
  const ghosts = presets.filter(
    (p) => p.width < frame.width && p.height < frame.height
  )

  return (
    <div
      data-slot="resolution-field-preview"
      aria-hidden="true"
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
      className={cn(
        "relative mx-auto flex w-full items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="relative h-full overflow-hidden rounded-md border bg-muted/40 transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: portrait ? `${portraitWidth}%` : "100%" }}
      >
        {ghosts.map((p) => (
          <div
            key={p.label}
            className="absolute left-0 top-0 rounded-br-sm border-b border-r border-dashed border-border"
            style={{
              width: `${pct(portrait ? p.height : p.width, F.width)}%`,
              height: `${pct(portrait ? p.width : p.height, F.height)}%`,
            }}
          >
            <span className="absolute bottom-0.5 right-1 text-[10px] leading-none text-muted-foreground/70">
              {p.label}
            </span>
          </div>
        ))}

        {/* An unset side (0) is unconstrained, so it spans the whole frame */}
        <div
          className={cn(
            "absolute left-0 top-0 rounded-br-sm border-b-2 border-r-2 border-primary bg-primary/15 transition-opacity duration-300 motion-reduce:transition-none",
            !hasValue && "opacity-0"
          )}
          style={{
            width: `${width ? pct(width, F.width) : 100}%`,
            height: `${height ? pct(height, F.height) : 100}%`,
          }}
        />

        {!hasValue && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            No minimum set
          </span>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Default layout (rendered when <ResolutionField /> has no children)         */
/* -------------------------------------------------------------------------- */

function ResolutionFieldDefaultLayout() {
  return (
    <>
      <ResolutionFieldHeader>
        <div className="grid gap-1">
          <ResolutionFieldLabel />
          <ResolutionFieldDescription />
        </div>
        <ResolutionFieldClear />
      </ResolutionFieldHeader>
      <ResolutionFieldOrientation />
      <ResolutionFieldPresets />
      <ResolutionFieldInputs />
      <ResolutionFieldPreview />
      <ResolutionFieldReadout />
    </>
  )
}

/* -------------------------------------------------------------------------- */

export {
  ResolutionField,
  ResolutionFieldHeader,
  ResolutionFieldLabel,
  ResolutionFieldDescription,
  ResolutionFieldClear,
  ResolutionFieldOrientation,
  ResolutionFieldOrientationItem,
  ResolutionFieldPresets,
  ResolutionFieldPreset,
  ResolutionFieldInputs,
  ResolutionFieldWidth,
  ResolutionFieldHeight,
  ResolutionFieldLock,
  ResolutionFieldPreview,
  ResolutionFieldReadout,
}

/* -------------------------------------------------------------------------- */
/*  Usage                                                                      */
/* -------------------------------------------------------------------------- */
/*
// 1) Drop-in (default layout)
const [min, setMin] = React.useState<Resolution | null>(null)
<ResolutionField value={min} onChange={setMin} />

// 2) Custom composition: keep what you want, swap or drop the rest
<ResolutionField value={min} onChange={setMin}>
  <ResolutionFieldLabel>Smallest allowed image</ResolutionFieldLabel>
  <ResolutionFieldPresets presets={[{ label: "Phone", width: 1920, height: 1080 }]} />
  <ResolutionFieldInputs>
    <ResolutionFieldWidth unit="wide" />
    <ResolutionFieldHeight unit="tall" />
  </ResolutionFieldInputs>
  <ResolutionFieldReadout format={(v) => (v ? `${v.width}×${v.height}+` : "No limit")} />
</ResolutionField>

// 3) react-hook-form + shadcn <Form>  (default the field to null, not undefined)
// schema: z.object({ width: z.number().int().min(0), height: z.number().int().min(0) }).nullable()
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
*/