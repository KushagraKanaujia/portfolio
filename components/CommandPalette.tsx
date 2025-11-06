"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Home,
  User,
  Briefcase,
  Code2,
  FolderGit2,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  Moon,
  Sun,
  Coffee,
  Zap,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const navigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank");
    setOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("light");
    setOpen(false);
  };

  const sendEmail = () => {
    window.location.href = "mailto:your-email@example.com";
    setOpen(false);
  };

  const downloadResume = () => {
    // TODO: Add your resume link
    window.open("#", "_blank");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-[20%] w-full max-w-2xl -translate-x-1/2 px-4">
        <Command className="glass-card overflow-hidden rounded-2xl shadow-2xl shadow-accent/20">
          <div className="flex items-center border-b border-white/10 px-4">
            <Zap className="mr-2 h-5 w-5 text-accent" />
            <Command.Input
              placeholder="Type a command or search..."
              className="w-full border-none bg-transparent py-4 text-base text-white outline-none placeholder:text-gray-500"
            />
            <kbd className="ml-auto hidden rounded bg-white/10 px-2 py-1 text-xs text-gray-400 sm:inline-block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="mb-2">
              <CommandItem
                icon={<Home className="h-4 w-4" />}
                label="Home"
                shortcut="↑"
                onSelect={() => navigate("home")}
              />
              <CommandItem
                icon={<User className="h-4 w-4" />}
                label="About"
                onSelect={() => navigate("about")}
              />
              <CommandItem
                icon={<Briefcase className="h-4 w-4" />}
                label="Experience"
                onSelect={() => navigate("experience")}
              />
              <CommandItem
                icon={<Code2 className="h-4 w-4" />}
                label="Skills"
                onSelect={() => navigate("skills")}
              />
              <CommandItem
                icon={<FolderGit2 className="h-4 w-4" />}
                label="Projects"
                onSelect={() => navigate("projects")}
              />
              <CommandItem
                icon={<Mail className="h-4 w-4" />}
                label="Contact"
                onSelect={() => navigate("contact")}
              />
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-white/10" />

            <Command.Group heading="Actions" className="mb-2">
              <CommandItem
                icon={<Mail className="h-4 w-4" />}
                label="Send Email"
                shortcut="⌘E"
                onSelect={sendEmail}
              />
              <CommandItem
                icon={<Download className="h-4 w-4" />}
                label="Download Resume"
                shortcut="⌘D"
                onSelect={downloadResume}
              />
              <CommandItem
                icon={theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                label={`Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`}
                shortcut="⌘T"
                onSelect={toggleTheme}
              />
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-white/10" />

            <Command.Group heading="Social">
              <CommandItem
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
                onSelect={() => openLink("https://github.com/KushagraKanaujia")}
              />
              <CommandItem
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                onSelect={() => openLink("https://linkedin.com/in/kushagra-kanaujia")}
              />
              <CommandItem
                icon={<Twitter className="h-4 w-4" />}
                label="Twitter"
                onSelect={() => openLink("https://twitter.com/kushagra")}
              />
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-white/10" />

            <Command.Group heading="Easter Eggs">
              <CommandItem
                icon={<Coffee className="h-4 w-4" />}
                label="Buy me a coffee ☕"
                onSelect={() => {
                  alert("Thanks for the thought! But I'm already caffeinated 😄");
                  setOpen(false);
                }}
              />
              <CommandItem
                icon={<Zap className="h-4 w-4" />}
                label="Hire me!"
                onSelect={() => {
                  sendEmail();
                }}
              />
            </Command.Group>
          </Command.List>

          <div className="border-t border-white/10 px-4 py-3 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>
                Press{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5">⌘K</kbd> to
                open
              </span>
              <span>
                Use{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5">↑↓</kbd> to
                navigate
              </span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}

function CommandItem({
  icon,
  label,
  shortcut,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/10 data-[selected=true]:bg-accent/20 data-[selected=true]:text-white"
    >
      <span className="text-accent">{icon}</span>
      <span className="flex-1">{label}</span>
      {shortcut && (
        <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-500">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
