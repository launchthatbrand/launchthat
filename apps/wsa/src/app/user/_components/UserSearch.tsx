import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@acme/ui/components/command";
import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  slug: string;
  email: string;
  avatar?: {
    url: string;
  };
  roles?: {
    nodes: {
      name: string;
    }[];
  };
}

interface UserSearchProps {
  users: User[];
  className?: string;
}

export function UserSearch({ users, className }: UserSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter users based on search query
  useEffect(() => {
    if (!query) {
      setFilteredUsers([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(searchQuery);
      const emailMatch = user.email.toLowerCase().includes(searchQuery);
      const roleMatch = user.roles?.nodes.some((role) =>
        role.name.toLowerCase().includes(searchQuery),
      );
      return nameMatch || emailMatch || roleMatch;
    });

    setFilteredUsers(filtered);
  }, [query, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (user: User) => {
      setOpen(false);
      setQuery("");
      router.push(`/user/${user.slug}`);
    },
    [router],
  );

  return (
    <div ref={searchRef} className={className}>
      <Command
        shouldFilter={false}
        className="relative z-50 overflow-visible rounded-lg border border-white/20 bg-[#f8f9fa]/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-[8.4px] [&_[cmdk-input-wrapper]]:px-3"
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500/10 via-black/5 to-black/10" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent" />
        <CommandInput
          placeholder="Search users by name, email or role..."
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setOpen(true);
          }}
          className="relative h-10 w-full border-none bg-transparent py-2 outline-none placeholder:text-black/60 focus:border-none focus:outline-none focus:ring-0"
        />
        <CommandList className="absolute top-[calc(100%+4px)] z-50 w-full rounded-lg border bg-white shadow-lg">
          {open && query ? (
            <>
              <CommandEmpty>No users found.</CommandEmpty>
              {filteredUsers.length > 0 && (
                <CommandGroup heading="Users">
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.name}
                      onSelect={() => handleSelect(user)}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        {user.avatar?.url && (
                          <AvatarImage src={user.avatar.url} />
                        )}
                        <AvatarFallback>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      {user.roles?.nodes[0] && (
                        <span className="text-sm text-muted-foreground">
                          {user.roles.nodes[0].name}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          ) : null}
        </CommandList>
      </Command>
    </div>
  );
}
