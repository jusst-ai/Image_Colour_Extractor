import ExploreGrid from "@/components/ExploreGrid";

const ExplorePage = () => {
  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-foreground tracking-light text-[32px] font-bold leading-tight min-w-72">
          Explore
        </p>
      </div>
      
      <div className="px-4">
        <ExploreGrid />
      </div>
    </div>
  );
};

export default ExplorePage;