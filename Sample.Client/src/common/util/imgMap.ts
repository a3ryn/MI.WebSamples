export const imgMap = new Map<number,string>(
    [
        //premises
		[0, 'Site.png'],
		[1, 'prompt1.png'],
		[2, 'endPrompt.png'],
		[30, 'noResponsePrompt.png'],
		[31, 'invalidPrompt.png'],
		[4, 'yesNoQuestion.png'],
		[5, 'triOptionQuestion.png'],
		[6, 'rankQuestion.png'],

        //...
        //racks, cabinets, frames
        [9, 'AuxiliaryRack'],// Auxiliary Rack
        [10, 'Rack.png'],//Rack (7 ft – 45U)
        [11, 'Rack.png'],//Rack (8 ft – 52U)
        [12, 'Cabinet.png'], //Cabinet (42U)
        //closures
        [61, '360G2FiberShelf.png'],
        [62, '360G2FiberShelf.png'],
        [63, '360G2FiberShelf.png'],
        //...
        //modules
        [92, 'Card.png'],
        //...
        //patch panels
        [22, 'iPatchCopperPanel.png'], //360 iPatch 1100 (24-Port)
        [58, 'QuattroPanel.png'], //Quattro Panel
        //...
        //network devices
        [74, 'NetworkedBladeServer.png'],//'Networked Blade Server'
        [19, 'iPatchManager.png'], //360 iPatch Panel Manager
        //...
        //ports
        [100, 'PortMPOUncabledAvailable.png'], //Generic Panel MPO Port
        [112, 'PortCUncabledAvailable.png'], //iPatch Port
        [109, 'PortFDUncabledAvailable.png'] //InstaPATCH Fiber Shelf Port
        //...
    ]);