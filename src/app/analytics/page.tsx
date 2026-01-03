export default function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-8 rounded-full mb-6">
            <span className="material-symbols-outlined text-6xl text-neutral-400 dark:text-neutral-500">
                analytics
            </span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Analytics Unavailable
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            We're working hard to bring you detailed insights and charts. Check back soon for updates!
        </p>
    </div>
  );
}
