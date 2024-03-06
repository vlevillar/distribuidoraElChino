import React from 'react'
import { Tabs, Tab } from "@nextui-org/react";

const RouteTabs = () => {
    return (
        <Tabs variant="underlined" aria-label="Tabs variants">
            <Tab key="domingo" title="Do" />
            <Tab key="lunes" title="Lu" />
            <Tab key="martes" title="Ma" />
            <Tab key="miercoles" title="Mi" />
            <Tab key="jueves" title="Ju" />
            <Tab key="viernes" title="Vi" />
            <Tab key="sabado" title="Sa" />
        </Tabs>
    )
}

export default RouteTabs