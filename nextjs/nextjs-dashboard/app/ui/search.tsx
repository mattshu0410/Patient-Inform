// This is a Client Component, which means you can use event listeners and hooks.
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  //useSearchParams- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}\
  // You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.

  //<Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
  //<Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
  //As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // Instead of a normal function declaration using a debounced callback means we aren't calling the server function with every single keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    //URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters. Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a.
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 1000);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
