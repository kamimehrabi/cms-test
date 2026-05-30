"use client"
import Script from 'next/script';
import CustomElement from '../base/CustomElement';
import { DealershipManifest } from '@/types/dealershipManifest';
import { useEffect } from 'react';

const Header = ({ script, manifest }: { script: string, manifest: DealershipManifest | null}) => {
    const header = manifest?.layout?.header

    useEffect(()=> {
        if (header) console.log("header bundle:", header.bundleUrlOrS3Key)
    }, [header])
    return (
        <>
            {/* <CustomElement element={"header-container"} /> */}
            {/* @ts-ignore */}
            <header-container></header-container>
            <Script strategy='afterInteractive' type="module" dangerouslySetInnerHTML={{ __html: script }} />
        </>
    )
}

export default Header