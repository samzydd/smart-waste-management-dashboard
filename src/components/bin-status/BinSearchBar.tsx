import { MapPinIcon } from '@heroicons/react/24/solid'

export function BinSearchBar() {
  return (
    <label className="flex h-9 w-[565px] max-w-full items-center gap-2 rounded-lg border border-border-strong bg-bg p-3 focus-within:border-accent">
      <MapPinIcon className="size-4 shrink-0 text-text-tertiary" />
      <input
        type="text"
        placeholder="Search province name, postal codes, street names, etc"
        className="w-full min-w-0 bg-transparent text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
      />
    </label>
  )
}
