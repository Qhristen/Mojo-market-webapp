"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, FolderIcon } from "lucide-react";
import { useState } from "react";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    core: true,
    verticals: false,
  });

  // Determine if any subcategory of verticals is expanded
  const [expandedVerticals, setExpandedVerticals] = useState<
    Record<string, boolean>
  >({
    assignments: false,
    placements: false,
    application: false, // Set this to true to expand application by default
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleVertical = (vertical: string) => {
    setExpandedVerticals((prev) => ({
      ...prev,
      [vertical]: !prev[vertical],
    }));
  };

  const categories = [
    {
      name: "Core",
      id: "core",
      items: [
        { name: "Basic Inputs", href: "/ui/core/basic-inputs" },
        {
          name: "Form Components",
          href: "/ui/core/form-components",
        },
        { name: "Data Display", href: "/ui/core/data-display" },
        {
          name: "Feature Components",
          href: "/ui/core/feature-components",
        },
        { name: "Layout", href: "/ui/core/layout" },
        { name: "Feedback", href: "/ui/core/feedback" },
      ],
    },
    
    
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/">
          <Button variant="outline" size="sm">
            ← Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          {/* <ColorPresetPicker />
          <ThemeToggle /> */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation with Collapsible Sections */}
        <div className="w-full md:w-64 md:shrink-0">
          <div className="sticky top-8 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center justify-between p-2 text-left font-medium rounded-md hover:bg-muted ${
                    pathname.includes(`/ui/${category.id}`)
                      ? "bg-muted/50"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4" />
                    {category.name}
                  </span>
                  {expandedCategories[category.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedCategories[category.id] && (
                  <div className="ml-5 pl-2 border-l space-y-1">
                    {category.id === "core" ? (
                      // Regular links for core components
                      category.items.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={
                              pathname === item.href ? "default" : "ghost"
                            }
                            size="sm"
                            className="w-full justify-start h-8 text-sm"
                          >
                            {item.name}
                          </Button>
                        </Link>
                      ))
                    ) : (
                      // Nested structure for verticals
                      <>
                        <Link href="/ui/verticals">
                          <Button
                            variant={
                              pathname === "/ui/verticals"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="w-full justify-start h-8 text-sm"
                          >
                            Overview
                          </Button>
                        </Link>

                        {/* Vertical Categories */}
                        {category.items.map((vertical: any) => (
                          <div key={vertical.id} className="space-y-1 mt-2">
                            <button
                              onClick={() => toggleVertical(vertical.id)}
                              className={`w-full flex items-center justify-between p-2 text-left text-sm rounded-md hover:bg-muted ${
                                pathname.includes(
                                  `/ui/verticals/${vertical.id}`
                                )
                                  ? "bg-muted/50"
                                  : ""
                              }`}
                            >
                              <span>{vertical.name}</span>
                              {expandedVerticals[vertical.id] ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>

                            {expandedVerticals[vertical.id] && (
                              <div className="ml-3 pl-2 border-l space-y-1">
                                {vertical.subItems.map((subItem: any) => (
                                  <Link key={subItem.href} href={subItem.href}>
                                    <Button
                                      variant={
                                        pathname === subItem.href
                                          ? "default"
                                          : "ghost"
                                      }
                                      size="sm"
                                      className="w-full justify-start h-7 text-xs"
                                    >
                                      {subItem.name}
                                    </Button>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
