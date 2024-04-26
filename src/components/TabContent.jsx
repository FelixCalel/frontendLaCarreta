import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { PasosEmpresa } from './PasosEmpresa'
import { TableData } from './TableData'


export const TabContent = () => {
  return (
    <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
            <Tab>Agregar empresa</Tab>
            <Tab>Mis empresas</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
             <PasosEmpresa />
            </TabPanel>
            <TabPanel>
             <TableData />
            </TabPanel>
        </TabPanels>
    </Tabs>
  )
}
