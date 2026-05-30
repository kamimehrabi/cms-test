"use client";

import { ReduxProvider } from "@/components/ReduxProvider";

import Header from "@/components/core/layout/Header";

import ExposeWidgetGlobals from "./ExposeWidgetGlobals";

import Footer from "@/components/core/layout/Footer";

import ContextBridge from "@/components/bridges/ContextBridge";

import ClientLayout from "./ClientLayout";

import RouteWatcher from "./RouteWatcher";

import React from 'react'
import { useClickHandler } from "@/hooks/edit-mode/hooks/useClickHandler";
import { useChangeTheme } from "@/hooks/pannel/useChangeTheme";
import type { DealershipManifest } from "@/types/dealershipManifest";

const ClientWrapperLayout = ({
    children,
    dealerData,
    HeaderLayout,
    FooterLayout,
    vehicles,
    manifest,
}: {
    children: React.ReactNode;
    dealerData: any;
    HeaderLayout: any;
    FooterLayout: any;
    vehicles: any;
    manifest: DealershipManifest | null;
}) => {
    const handleBodyClick = useClickHandler(true);
    useChangeTheme();

    return (
        <>
            <body className={`antialiased`} onClick={handleBodyClick}   >
                <ExposeWidgetGlobals />
                <ReduxProvider>
                    <ClientLayout dealerData={dealerData} vehicles={vehicles} manifest={manifest} />
                    <RouteWatcher />
                    <ContextBridge />
                    <Header script={HeaderLayout} manifest={manifest} />
                    {children}
                    <Footer script={FooterLayout} />
                </ReduxProvider>
            </body>
        </>
    );
};

export default ClientWrapperLayout;