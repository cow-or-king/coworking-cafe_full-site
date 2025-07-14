"use client";

import { HandCoins, Home, Settings2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import logo from "../../public/logo.svg";
// import logo from "../../public/icon.ico";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { shouldShowDevFeatures } from "@/lib/env-utils";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

const data = {
  user: {
    name: "Twe",
    email: "dev@coworkingcafe.fr",
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "Finances",
      url: "/",
      icon: HandCoins,
      isActive: false,
      items: [
        {
          title: "Controle de caisse",
          url: "/accounting/cash-control",
        },
        // {
        //   title: "PDF Controle de caisse",
        //   url: "/accounting/cash-control/pdf",
        // },
      ],
    },
    {
      title: "Personnel",
      url: "/",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Liste du personnel",
          url: "/list",
        },
        {
          title: "Pointage du personnel",
          url: "/score",
        },
      ],
    },
    // Section Settings - uniquement en développement
    ...(shouldShowDevFeatures() ? [{
      title: "Réglages",
      url: "/settings",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Optimisation",
          url: "/settings/optimization",
        },
        {
          title: "Test Optimisation",
          url: "/settings/optimization-test",
        },
        {
          title: "Code Splitting Demo",
          url: "/settings/code-splitting",
        },
        {
          title: "Migration Dashboard",
          url: "/settings/migration-dashboard",
        },
        {
          title: "Section Cards Test",
          url: "/settings/section-cards",
        },
        // {
        //   title: "Configuration",
        //   url: "/settings/general",
        // },
      ],
    }] : []),
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground overflow-hidden rounded-md py-2">
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex h-6 items-center gap-4 text-black">
                    <Image
                      src={logo}
                      width={32}
                      height={32}
                      alt="Picture of the brand"
                      className="invert filter"
                    />
                    <span>Cow or King Café</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
