import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'

export default function NavigationDropdown({dropdown}) {
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center gap-x-1 outline-none hover:text-highlight">
        <span className="uppercase font-medium">{dropdown.dropdown_label}</span>
        <ChevronDownIcon aria-hidden="true" className="size-5" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="max-w-xs flex-auto overflow-hidden bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="p-3">
            {dropdown.dropdown_items.map((item) => (
              <div key={item.dropdown_item_link} className="group relative flex gap-x-6 p-2">
{/*                <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                </div>*/}
                <div>
                  <a href={item.dropdown_item_link} className="">
                    {item.dropdown_item_text}
                    <span className="absolute inset-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}