import { PlusIcon, TruckIcon } from '@heroicons/react/24/solid'

export function TruckSearchBar() {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <label className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border-strong bg-bg p-3 focus-within:border-accent">
        <TruckIcon className="size-4 shrink-0 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search truck ID or drivers"
          className="w-full min-w-0 bg-transparent text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
        />
      </label>
      <button className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-[#bfbfbf] transition-colors hover:bg-[#242424]">
        <PlusIcon className="size-4" />
        Register truck
      </button>
    </div>
  )
}
