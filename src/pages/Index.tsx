
import TextRedactor from "@/components/TextRedactor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Text Redaction Tool
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Automatically detect and redact sensitive information from text to ensure data privacy and compliance with security standards.
          </p>
        </div>
        <TextRedactor />
      </div>
    </div>
  );
};

export default Index;
