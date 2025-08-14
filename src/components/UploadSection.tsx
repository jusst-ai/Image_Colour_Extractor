import { Button } from "@/components/ui/button";

const UploadSection = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">
        Upload new image
      </h2>
      <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-border px-6 py-14">
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
            Drag and drop an image here
          </p>
          <p className="text-foreground text-sm font-normal leading-normal max-w-[480px] text-center">
            Or click to browse
          </p>
        </div>
        <Button variant="secondary" className="px-4">
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadSection;