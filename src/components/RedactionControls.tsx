import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import type { RedactionOptions } from "@/components/utils/redactionUtils";

interface RedactionControlsProps {
  options: RedactionOptions;
  onOptionsChange: (options: RedactionOptions) => void;
}

const RedactionControls = ({
  options,
  onOptionsChange,
}: RedactionControlsProps) => {
  const updateOption = (
    key: keyof RedactionOptions,
    value: boolean | string
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-green-50 border-b">
        <CardTitle className="flex items-center gap-2 text-slate-700">
          <Settings className="h-5 w-5 text-green-600" />
          Redaction Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Detection Types
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="emails" className="text-sm">
                  Email Addresses
                </Label>
                <Switch
                  id="emails"
                  checked={options.emails}
                  onCheckedChange={(checked) => updateOption("emails", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="phoneNumbers" className="text-sm">
                  Phone Numbers
                </Label>
                <Switch
                  id="phoneNumbers"
                  checked={options.phoneNumbers}
                  onCheckedChange={(checked) =>
                    updateOption("phoneNumbers", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ssn" className="text-sm">
                  Social Security Numbers
                </Label>
                <Switch
                  id="ssn"
                  checked={options.ssn}
                  onCheckedChange={(checked) => updateOption("ssn", checked)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Advanced Detection
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="creditCards" className="text-sm">
                  Credit Card Numbers
                </Label>
                <Switch
                  id="creditCards"
                  checked={options.creditCards}
                  onCheckedChange={(checked) =>
                    updateOption("creditCards", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="names" className="text-sm">
                  Names (Beta)
                </Label>
                <Switch
                  id="names"
                  checked={options.names}
                  onCheckedChange={(checked) => updateOption("names", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="addresses" className="text-sm">
                  Addresses (Beta)
                </Label>
                <Switch
                  id="addresses"
                  checked={options.addresses}
                  onCheckedChange={(checked) =>
                    updateOption("addresses", checked)
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
              Redaction Style
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="redactionChar" className="text-sm">
                  Redaction Character
                </Label>
                <Input
                  id="redactionChar"
                  value={options.redactionChar}
                  onChange={(e) =>
                    updateOption(
                      "redactionChar",
                      e.target.value.charAt(0) || "█"
                    )
                  }
                  className="mt-1 w-20"
                  maxLength={1}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="preserveLength" className="text-sm">
                  Preserve Length
                </Label>
                <Switch
                  id="preserveLength"
                  checked={options.preserveLength}
                  onCheckedChange={(checked) =>
                    updateOption("preserveLength", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RedactionControls;
