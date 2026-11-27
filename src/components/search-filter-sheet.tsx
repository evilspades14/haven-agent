import {
  CaretUpDownIcon,
  CubeIcon,
  FrameCornersIcon,
  HandPeaceIcon,
  Icon,
  PaletteIcon,
  ShapesIcon,
  ShieldIcon,
  SmileyIcon,
  SmileyMeltingIcon,
  SmileyXEyesIcon,
  UserIcon,
} from "@phosphor-icons/react";
import {
  ResolutionField,
  ResolutionFieldClear,
  ResolutionFieldHeight,
  ResolutionFieldInputs,
  ResolutionFieldLock,
  ResolutionFieldOrientation,
  ResolutionFieldPresets,
  ResolutionFieldPreview,
  ResolutionFieldReadout,
  ResolutionFieldWidth,
} from "./experimental/resolution-field";
import { Field, FieldGroup } from "./ui/field";
import { useStoreValue } from "@/hooks/use-settings";
import useWallhavenClientParamsStore from "@/hooks/wallhaven-params";
import WallpaperColorBar from "./wallpaper-color-bar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Switch } from "./ui/switch";
import {
  buildSearchCategories,
  buildSearchPurities,
  ParsedSearchCategories,
  ParsedSearchPurities,
  parseSearchCategories,
  parseSearchPurities,
} from "@/types/utils";
import {
  defaultSearchParametersCategories,
  defaultSearchParametersPurities,
} from "@/types/default/defaultSearchParameters";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";

type SearchFilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SEARCH_CATEGORIES: {
  value: keyof ParsedSearchCategories;
  label: string;
  icon: Icon;
}[] = [
  { value: "general", label: "General", icon: CubeIcon },
  { value: "anime", label: "Anime", icon: HandPeaceIcon },
  { value: "people", label: "People", icon: UserIcon },
];

const SEARCH_PURITIES: {
  value: keyof ParsedSearchPurities;
  label: string;
  icon: Icon;
}[] = [
  { value: "sfw", label: "SFW", icon: SmileyIcon },
  { value: "sketchy", label: "SKETCHY", icon: SmileyMeltingIcon },
  { value: "nsfw", label: "NSFW", icon: SmileyXEyesIcon },
];

function SearchFilterSheet({ open, onOpenChange }: SearchFilterSheetProps) {
  const params = useWallhavenClientParamsStore((state) => state.params);
  const updateParams = useWallhavenClientParamsStore(
    (state) => state.updateParams,
  );
  const [_apiKey, _updateApiKey] = useStoreValue<string | undefined>(
    "apiKey",
    undefined,
  );
  console.log(params);
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Search Options</DrawerTitle>
        </DrawerHeader>

        {/*<Accordion
          value={selectedFilter}
          onValueChange={(value) => setSelectedFilter(value)}
          type="single"
        >
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <ToggleGroup
                type="multiple"
                className="grid grid-cols-3"
                variant={"outline"}
                value={objParamToArray(params?.categories ?? {})}
                onValueChange={(
                  value: Array<keyof SearchParametersCategories>,
                ) =>
                  !!value &&
                  updateParams({
                    categories:
                      categoryValuestoCategoryParam<SearchParametersCategories>(
                        value,
                      ),
                  })
                }
              >
                <ToggleGroupItem value={"general"}>
                  <CubeIcon /> General
                </ToggleGroupItem>
                <ToggleGroupItem value={"people"}>
                  <UserIcon /> People
                </ToggleGroupItem>
                <ToggleGroupItem value={"anime"}>
                  <HandPeaceIcon /> Anime
                </ToggleGroupItem>
              </ToggleGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>*/}

        <FieldGroup className="p-4">
          <Collapsible>
            <Field>
              <CollapsibleTrigger asChild>
                <Button variant={"ghost"} className="w-full">
                  <ShapesIcon />
                  Category
                  <CaretUpDownIcon className="ml-auto" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-1">
                {SEARCH_CATEGORIES.map((cat, idx) => (
                  <Item variant={"muted"} key={`category-${idx}`}>
                    <ItemMedia>
                      <cat.icon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="select-none">{cat.label}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Switch
                        checked={
                          parseSearchCategories(
                            params.categories ??
                              defaultSearchParametersCategories(),
                          )?.[cat.value] ?? false
                        }
                        onCheckedChange={(value) => {
                          updateParams({
                            categories: buildSearchCategories({
                              ...parseSearchCategories(
                                defaultSearchParametersCategories(),
                              ),
                              ...(params?.categories &&
                                parseSearchCategories(params.categories)),
                              [cat.value as keyof ParsedSearchCategories]:
                                value,
                            }),
                          });
                        }}
                      />
                    </ItemActions>
                  </Item>
                ))}
              </CollapsibleContent>
            </Field>
          </Collapsible>

          <Collapsible>
            <Field>
              <CollapsibleTrigger asChild>
                <Button variant={"ghost"} className="w-full">
                  <ShieldIcon />
                  Purity
                  <CaretUpDownIcon className="ml-auto" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-1">
                {SEARCH_PURITIES.map((cat, idx) => (
                  <Item variant={"muted"} key={`purity-${idx}`}>
                    <ItemMedia>
                      <cat.icon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{cat.label}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Switch
                        checked={
                          parseSearchPurities(
                            params.purity ?? defaultSearchParametersPurities(),
                          )?.[cat.value] ?? false
                        }
                        onCheckedChange={(value) => {
                          updateParams({
                            purity: buildSearchPurities({
                              ...parseSearchPurities(
                                defaultSearchParametersPurities(),
                              ),
                              ...(params?.purity &&
                                parseSearchPurities(params.purity)),
                              [cat.value as keyof ParsedSearchPurities]: value,
                            }),
                          });
                        }}
                      />
                    </ItemActions>
                  </Item>
                ))}
              </CollapsibleContent>
            </Field>
          </Collapsible>

          <Collapsible>
            <Field>
              <CollapsibleTrigger asChild>
                <Button variant={"ghost"} className="w-full">
                  <PaletteIcon />
                  Colors
                  <CaretUpDownIcon className="ml-auto" />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <WallpaperColorBar
                  value={params.colors ?? undefined}
                  onValueChange={(value) => updateParams({ colors: value })}
                  mode="edit"
                />
              </CollapsibleContent>
            </Field>
          </Collapsible>

          {/*<Field>
            <FieldLabel>Category</FieldLabel>
            <ToggleGroup
              type="multiple"
              className="grid grid-cols-3"
              variant={"outline"}
              value={objParamToArray(params?.categories ?? {})}
              onValueChange={(value: Array<keyof SearchParametersCategories>) =>
                !!value &&
                updateParams({
                  categories:
                    categoryValuestoCategoryParam<SearchParametersCategories>(
                      value,
                    ),
                })
              }
            >
              <ToggleGroupItem value={"general"}>
                <CubeIcon /> General
              </ToggleGroupItem>
              <ToggleGroupItem value={"people"}>
                <UserIcon /> People
              </ToggleGroupItem>
              <ToggleGroupItem value={"anime"}>
                <HandPeaceIcon /> Anime
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>*/}
          {/*<Field>
            <FieldLabel>Purity</FieldLabel>
            <ToggleGroup
              type="multiple"
              className="grid grid-cols-3"
              variant={"outline"}
              value={objParamToArray(params?.purity ?? {})}
              onValueChange={(value: Array<keyof SearchParametersPurities>) =>
                !!value &&
                updateParams({
                  purity:
                    categoryValuestoCategoryParam<SearchParametersPurities>(
                      value,
                    ),
                })
              }
            >
              <ToggleGroupItem value={"sfw"}>
                <SmileyIcon /> SFW
              </ToggleGroupItem>
              <ToggleGroupItem value={"sketchy"}>
                <SmileyMeltingIcon /> SKETCHY
              </ToggleGroupItem>
              <ToggleGroupItem value={"nsfw"} disabled={!apiKey}>
                <SmileyXEyesIcon /> NSFW
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>*/}
          {/*<ResolutionField
            value={params?.atleast ?? null}
            onChange={(value) => updateParams({ atleast: value })}
          />*/}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant={"ghost"} className="w-full">
                <FrameCornersIcon />
                Minimum Resolution
                <CaretUpDownIcon className="ml-auto" />
              </Button>
              {/*<Item variant={"outline"} className="bg-background">
                <ItemMedia variant={"icon"}>
                  <FrameCornersIcon/>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    Resolution
                  </ItemTitle>
                  <ItemDescription>
                    Minimum width and height
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <CaretUpDownIcon/>
                </ItemActions>
              </Item>*/}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ResolutionField
                value={params?.atleast ?? null}
                onChange={(value) => updateParams({ atleast: value })}
                className="mt-2"
              >
                <ResolutionFieldOrientation />
                <ResolutionFieldPresets
                  className="grid grid-cols-2"
                  presets={[
                    { label: "HD", width: 1280, height: 720 },
                    { label: "Full HD", width: 1920, height: 1080 },
                    { label: "QHD", width: 2560, height: 1440 },
                    { label: "4K", width: 3840, height: 2160 },
                  ]}
                />
                <ResolutionFieldInputs>
                  <ResolutionFieldWidth unit="wide" />
                  <ResolutionFieldLock />
                  <ResolutionFieldHeight unit="tall" />
                </ResolutionFieldInputs>
                <ResolutionFieldPreview />
                <ResolutionFieldReadout
                  format={(v) => (v ? `${v.width}×${v.height}+` : "No limit")}
                />
                <ResolutionFieldClear />
              </ResolutionField>
            </CollapsibleContent>
          </Collapsible>
        </FieldGroup>
      </DrawerContent>
    </Drawer>
  );
}

export default SearchFilterSheet;
