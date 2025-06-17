import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import RedactionControls from "./RedactionControls";
import { redactText } from "@/components/utils/redactionUtils";
import type {
  RedactionOptions,
  DetectedSensitiveData,
} from "@/components/utils/redactionUtils";

const TextRedactor = () => {
  const [inputText, setInputText] = useState("");
  const [redactedText, setRedactedText] = useState("");
  const [detectedData, setDetectedData] = useState<DetectedSensitiveData[]>([]);
  const [showOriginal, setShowOriginal] = useState(false);
  const [redactionOptions, setRedactionOptions] = useState<RedactionOptions>({
    emails: true,
    phoneNumbers: true,
    ssn: true,
    creditCards: true,
    names: false,
    addresses: false,
    redactionChar: "█",
    preserveLength: true,
  });

  useEffect(() => {
    if (inputText.trim()) {
      const result = redactText(inputText, redactionOptions);
      setRedactedText(result.redactedText);
      setDetectedData(result.detectedData);
    } else {
      setRedactedText("");
      setDetectedData([]);
    }
  }, [inputText, redactionOptions]);

  const handleCopyRedacted = async () => {
    try {
      await navigator.clipboard.writeText(redactedText);
      toast.success("Redacted text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const sampleText = `Contact John Smith at john.smith@email.com or call (555) 123-4567. 
His SSN is 123-45-6789 and credit card number is 4532-1234-5678-9012.
Address: 123 Main Street, Anytown, NY 10001.`;

  const handleLoadSample = () => {
    setInputText(sampleText);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <RedactionControls
        options={redactionOptions}
        onOptionsChange={setRedactionOptions}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Shield className="h-5 w-5" />
              Original Text
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              placeholder="Enter text containing sensitive information..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={handleLoadSample}
                className="text-slate-600 border-slate-300 hover:bg-slate-50"
              >
                Load Sample Text
              </Button>
              <div className="text-sm text-slate-500">
                {inputText.length} characters
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Redacted Text
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="text-slate-600 hover:bg-blue-100"
                >
                  {showOriginal ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showOriginal ? "Hide" : "Show"} Original
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyRedacted}
                  disabled={!redactedText}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="min-h-[300px] p-4 bg-slate-50 rounded-lg border border-slate-200 whitespace-pre-wrap font-mono text-sm">
              {showOriginal
                ? inputText
                : redactedText || "Redacted text will appear here..."}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-500">
                {redactedText.length} characters
              </div>
              <div className="text-sm text-slate-500">
                {detectedData.length} sensitive item
                {detectedData.length !== 1 ? "s" : ""} detected
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection Summary */}
      {detectedData.length > 0 && (
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-amber-50 border-b">
            <CardTitle className="text-slate-700">Detection Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {Object.entries(
                detectedData.reduce((acc, item) => {
                  acc[item.type] = (acc[item.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {type.replace(/([A-Z])/g, " $1").toLowerCase()}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextRedactor;
