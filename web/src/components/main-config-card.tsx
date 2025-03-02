import { UrlPatternTip } from "@/components/tips/url-pattern-tip.tsx";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormSchema } from "@/types/schema.ts";
import { MainConfig } from "@/types/shell.ts";

import { JreTip } from "@/components/tips/jre-tip.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  ArrowUpRightIcon,
  AxeIcon,
  CommandIcon,
  NetworkIcon,
  ServerIcon,
  ShieldOffIcon,
  SwordIcon,
  WaypointsIcon,
} from "lucide-react";
import { JSX, useState } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

const JDKVersion = [
  { name: "Java6", value: "50" },
  { name: "Java8", value: "52" },
  { name: "Java9", value: "53" },
  { name: "Java11", value: "55" },
  { name: "Java17", value: "61" },
  { name: "Java21", value: "65" },
];

type ShellToolType = "Behinder" | "Godzilla" | "Command" | "AntSword" | "Suo5" | "Neo-reGeorg";

const shellToolIcons: Record<ShellToolType, JSX.Element> = {
  Behinder: <ShieldOffIcon className="h-4 w-4" />,
  Godzilla: <AxeIcon className="h-4 w-4" />,
  Command: <CommandIcon className="h-4 w-4" />,
  AntSword: <SwordIcon className="h-4 w-4" />,
  Suo5: <WaypointsIcon className="h-4 w-4" />,
  "Neo-reGeorg": <NetworkIcon className="h-4 w-4" />,
};

export function MainConfigCard({
  mainConfig,
  form,
  servers,
}: {
  mainConfig: MainConfig | undefined;
  form: UseFormReturn<FormSchema>;
  servers?: string[];
}) {
  const [shellToolMap, setShellToolMap] = useState<{
    [toolName: string]: string[];
  }>();
  const [shellTools, setShellTools] = useState<string[]>([
    "Behinder",
    "Godzilla",
    "Command",
    "AntSword",
    "Suo5",
    "Neo-reGeorg",
  ]);
  const [shellTypes, setShellTypes] = useState<string[]>([]);
  const shellTool = form.watch("shellTool");
  const { t } = useTranslation();

  const handleServerChange = (value: string) => {
    if (mainConfig) {
      const newShellToolMap = mainConfig[value];
      setShellToolMap(newShellToolMap);
      const newShellTools = Object.keys(newShellToolMap);
      setShellTools(newShellTools);
      if (newShellTools.length > 0) {
        const firstTool = newShellTools[0];
        setShellTypes(newShellToolMap[firstTool]);
        form.setValue("shellTool", firstTool);
      } else {
        setShellTypes([]);
      }

      if (
        (value === "SpringWebFlux" || value === "XXLJOB") &&
        Number.parseInt(form.getValues("targetJdkVersion") as string) < 52
      ) {
        form.setValue("targetJdkVersion", "52");
      } else {
        form.resetField("targetJdkVersion");
      }
      form.resetField("bypassJavaModule");
      form.resetField("shellTool");
      form.resetField("shellType");
      form.resetField("urlPattern");
    }
  };

  const handleShellToolChange = (value: string) => {
    const resetCommand = () => {
      form.resetField("commandParamName");
    };

    const resetGodzilla = () => {
      form.resetField("godzillaKey");
      form.resetField("godzillaPass");
      form.resetField("headerName");
      form.resetField("headerValue");
    };

    const resetBehinder = () => {
      form.resetField("behinderPass");
      form.resetField("headerName");
      form.resetField("headerValue");
    };

    const resetSuo5 = () => {
      form.resetField("headerName");
      form.resetField("headerValue");
    };

    const resetAntSword = () => {
      form.resetField("antSwordPass");
      form.resetField("headerName");
      form.resetField("headerValue");
    };

    if (shellToolMap) {
      setShellTypes(shellToolMap[value]);
      form.resetField("urlPattern");
      form.resetField("shellType");
      form.resetField("shellClassName");
      form.resetField("injectorClassName");
      if (value === "Godzilla") {
        resetGodzilla();
      } else if (value === "Behinder") {
        resetBehinder();
      } else if (value === "Command") {
        resetCommand();
      } else if (value === "Suo5") {
        resetSuo5();
      } else if (value === "AntSword") {
        resetAntSword();
      }
    }
    form.setValue("shellTool", value);
  };

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-md flex items-center gap-2">
            <ServerIcon className="h-5" />
            <span>{t("configs.main-config")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="server"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="h-6 flex items-center">{t("mainConfig.server")}</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      handleServerChange(v);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={t("placeholders.select")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servers?.map((server: string) => (
                        <SelectItem key={server} value={server}>
                          {server}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex items-center">
                    {t("tips.targetServerNotFound")}&nbsp;
                    <a
                      href="https://github.com/ReaJason/MemShellParty/issues/new?template=%E8%AF%B7%E6%B1%82%E9%80%82%E9%85%8D.md"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center underline"
                    >
                      {t("tips.targetServerRequest")}
                      <ArrowUpRightIcon className="h-4" />
                    </a>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetJdkVersion"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="h-6 flex items-center gap-1">
                    {t("mainConfig.jre")} {t("optional")} <JreTip />
                  </FormLabel>
                  <Select
                    onValueChange={(v) => {
                      if (Number.parseInt(v) >= 53) {
                        form.setValue("bypassJavaModule", true);
                      } else {
                        form.setValue("bypassJavaModule", false);
                      }
                      field.onChange(v);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={t("placeholders.select")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JDKVersion.map((v) => (
                        <SelectItem key={v.value} value={v.value}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <FormField
              control={form.control}
              name="debug"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch id="debug" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel htmlFor="debug">{t("mainConfig.debug")}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bypassJavaModule"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2  space-y-0">
                  <FormControl>
                    <Switch id="bypassJavaModule" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <Label htmlFor="bypassJavaModule">{t("mainConfig.bypassJavaModule")}</Label>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shrink"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch id="shrink" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <Label htmlFor="shrink">{t("mainConfig.shrink")}</Label>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      <Tabs
        value={shellTool}
        onValueChange={(v) => {
          handleShellToolChange(v);
        }}
        className="w-full"
      >
        <div className="relative bg-muted rounded-lg">
          <TabsList className="flex flex-wrap gap-1 w-full bg-transparent tabs-list">
            {shellTools.map((shellTool) => (
              <TabsTrigger
                key={shellTool}
                value={shellTool}
                className="flex-1 min-w-24 data-[state=active]:bg-background"
              >
                <span className="flex items-center gap-2">
                  {shellToolIcons[shellTool as ShellToolType]}
                  {shellTool}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <BehinderTabContent form={form} shellTypes={shellTypes} />
        <GodzillaTabContent form={form} shellTypes={shellTypes} />
        <CommandTabContent form={form} shellTypes={shellTypes} />
        <AntSwordTabContent form={form} shellTypes={shellTypes} />
        <Suo5TabContent form={form} shellTypes={shellTypes} />
        <NeoreGeorgTabContent />
      </Tabs>
    </FormProvider>
  );
}

function ShellTypeFormField({ form, shellTypes }: { form: UseFormReturn<FormSchema>; shellTypes: Array<string> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <FormField
        control={form.control}
        name="shellType"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="h-6 flex items-center">{t("mainConfig.shellMountType")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={t("placeholders.select")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent key={shellTypes.join(",")}>
                {shellTypes.length ? (
                  shellTypes.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value=" ">{t("tips.shellToolNotSelected")}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </FormProvider>
  );
}

function UrlPatternFormField({ form }: { form: UseFormReturn<FormSchema> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <FormField
        control={form.control}
        name="urlPattern"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="h-6 flex items-center gap-1">
              {t("mainConfig.urlPattern")} <UrlPatternTip />
            </FormLabel>
            <Input {...field} placeholder={t("placeholders.input")} className="h-8" />
          </FormItem>
        )}
      />
    </FormProvider>
  );
}

function OptionalClassFormField({ form }: { form: UseFormReturn<FormSchema> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <FormField
        control={form.control}
        name="shellClassName"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="h-6 flex items-center gap-1">
              {t("mainConfig.shellClassName")} {t("optional")}
            </FormLabel>
            <Input id="shellClassName" {...field} placeholder={t("placeholders.input")} className="h-8" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="injectorClassName"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="h-6 flex items-center gap-1">
              {t("mainConfig.injectorClassName")} {t("optional")}
            </FormLabel>
            <Input id="injectorClassName" {...field} placeholder={t("placeholders.input")} className="h-8" />
          </FormItem>
        )}
      />
    </FormProvider>
  );
}

function BehinderTabContent({ form, shellTypes }: { form: UseFormReturn<FormSchema>; shellTypes: Array<string> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <TabsContent value="Behinder">
        <Card>
          <CardContent className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <ShellTypeFormField form={form} shellTypes={shellTypes} />
              <UrlPatternFormField form={form} />
            </div>
            <FormField
              control={form.control}
              name="behinderPass"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.behinderPass")}</FormLabel>
                  <Input {...field} placeholder={t("placeholders.input")} className="h-8" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="headerName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerName")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerName")} className="h-8" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headerValue"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerValue")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerValue")} className="h-8" />
                  </FormItem>
                )}
              />
            </div>
            <OptionalClassFormField form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </FormProvider>
  );
}

function GodzillaTabContent({ form, shellTypes }: { form: UseFormReturn<FormSchema>; shellTypes: Array<string> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <TabsContent value="Godzilla">
        <Card>
          <CardContent className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <ShellTypeFormField form={form} shellTypes={shellTypes} />
              <UrlPatternFormField form={form} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="godzillaPass"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.pass")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.pass")} className="h-8" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="godzillaKey"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.key")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.key")} className="h-8" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headerName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerName")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerName")} className="h-8" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headerValue"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerValue")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerValue")} className="h-8" />
                  </FormItem>
                )}
              />
            </div>
            <OptionalClassFormField form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </FormProvider>
  );
}

function CommandTabContent({ form, shellTypes }: { form: UseFormReturn<FormSchema>; shellTypes: Array<string> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <TabsContent value="Command">
        <Card>
          <CardContent className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <ShellTypeFormField form={form} shellTypes={shellTypes} />
              <UrlPatternFormField form={form} />
            </div>
            <FormField
              control={form.control}
              name="commandParamName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.paramName")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("shellToolConfig.paramName")} className="h-8" />
                  </FormControl>
                </FormItem>
              )}
            />
            <OptionalClassFormField form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </FormProvider>
  );
}

function AntSwordTabContent({ form, shellTypes }: { form: UseFormReturn<FormSchema>; shellTypes: Array<string> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <TabsContent value="AntSword">
        <Card>
          <CardContent className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <ShellTypeFormField form={form} shellTypes={shellTypes} />
              <UrlPatternFormField form={form} />
            </div>
            <FormField
              control={form.control}
              name="antSwordPass"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.antSwordPass")}</FormLabel>
                  <Input {...field} placeholder={t("placeholders.input")} className="h-8" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="headerName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerName")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerName")} className="h-8" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headerValue"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerValue")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerValue")} className="h-8" />
                  </FormItem>
                )}
              />
            </div>
            <OptionalClassFormField form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </FormProvider>
  );
}

function Suo5TabContent({ form, shellTypes }: { form: UseFormReturn<FormSchema>; shellTypes: Array<string> }) {
  const { t } = useTranslation();
  return (
    <FormProvider {...form}>
      <TabsContent value="Suo5">
        <Card>
          <CardContent className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <ShellTypeFormField form={form} shellTypes={shellTypes} />
              <UrlPatternFormField form={form} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="headerName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerName")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerName")} className="h-8" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headerValue"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="h-6 flex items-center gap-1">{t("shellToolConfig.headerValue")}</FormLabel>
                    <Input {...field} placeholder={t("shellToolConfig.headerValue")} className="h-8" />
                  </FormItem>
                )}
              />
            </div>
            <OptionalClassFormField form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </FormProvider>
  );
}

function NeoreGeorgTabContent() {
  return (
    <TabsContent value="Neo-reGeorg">
      <Card>
        <CardContent className="space-y-2 mt-4">
          <div className="flex items-center justify-center">
            <span className="text-gray-500">WIP</span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
