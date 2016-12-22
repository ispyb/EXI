var ExtISPyB ={
   version : '0.9.8',
   release_date : '2016/12/08',
   
   /**
    *   P1211 is a synonym for P21
        P121 is a synonym for P2
        C121 is a synonym for C2

    */
   spaceGroups : ["P1", "P121", "P1211", "C121", "P222", "P2221", "P21212", "P212121", "C2221", "C222", "F222", "I222", "I212121", "P4", "P41", "P42", "P43", "I4", "I41", "P422", "P4212", "P4122", "P41212", "P4222", "P42212", "P4322", "P43212", "I422", "I4122", "P3", "P31", "P32", "H3","R3", "P312", "P321", "P3112", "P3121", "P3212", "P3221", "H32", "R32", "P6", "P61", "P65", "P62", "P64", "P63", "P622", "P6122", "P6522", "P6222", "P6422", "P6322", "P23", "F23", "I23", "P213", "I213", "P432", "P4232", "F432", "F4132", "I432", "P4332", "P4132", "I4132"],   
   detectors : {

	"Pilatus3_2M" : {
				pixelSize: {
						x : 1475,
						y : 1679
				},
				sensitiveArea : {
						x : 253.7,
						y : 288.8
				},
				pixelSizeHorizontal : 0.172,
				img : "https://www.dectris.com/tl_files/root/products/PILATUS%20S%20Serie/Systems/PILATUS3_S_2M.png"

	},
	"Pilatus_6M_F" : {
				pixelSize: {
						x : 2463,
						y : 2527
				},
				sensitiveArea : {
						x : 423.6,
						y : 434.6
				},
				pixelSizeHorizontal : 0.172,
				img : "https://www.dectris.com/tl_files/root/products/PILATUS%20S%20Serie/Systems/PILATUS3_S_6M.png"

	},
	"Pilatus3_6M" : {
				pixelSize: {
						x : 2463,
						y : 2527
				},
				sensitiveArea : {
						x : 423.6,
						y : 434.6
				},
				pixelSizeHorizontal : 0.172,
				img : "https://www.dectris.com/tl_files/root/products/PILATUS%20S%20Serie/Systems/PILATUS3_S_6M.png"

	}



   },
   sites:[
        {
         name:'ESRF',
         description : 'European Synchroton Radiation Facility',
         icon : '../images/site/esrf.png',
         url:'https://wwws.esrf.fr/ispyb/ispyb-ws/rest',
         exiUrl:'https://wwws.esrf.fr/ispyb/ispyb-ws/rest',
         beamlines:{
            SAXS:[
               {
                name : 'BM29',
                sampleChangerType : ''
   	       }

            ],
            MX:[
               { 
                   name : "ID23-1",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID23-2",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID29",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID30A-1",
                   sampleChangerType : 'RoboDiff'
               },
               { 
                   name : "ID30A-2",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID30A-3",
                   sampleChangerType : 'FlexHCD'
               },
               { 
                   name : "ID30B",
                   sampleChangerType : 'FlexHCD'
               },
               { 
                   name : "BM14U",
                   sampleChangerType : 'FlexHCD'
               },
               { 
                   name : "BM30A",
                   sampleChangerType : 'FlexHCD'
               }                                             
            ]
         }
      },    
      {
         name:'ESRF TEST',
         url:'http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest',
         icon : '../images/site/dev.esrf.png',
		 exiUrl:'http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest',
         beamlines:{
            SAXS:[

               {
		   name : 'BM29',
		   sampleChangerType : ''
   	       }
            ],
            MX:[
               { 
                   name : "ID23-1",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID23-2",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID29",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID30A-1",
                   sampleChangerType : 'RoboDiff'
               },
               { 
                   name : "ID30A-2",
                   sampleChangerType : 'SC3'
               },
               { 
                   name : "ID30A-3",
                   sampleChangerType : 'FlexHCD'
               },
               { 
                   name : "ID30B",
                   sampleChangerType : 'FlexHCD'
               },
               { 
                   name : "BM14U",
                   sampleChangerType : 'FlexHCD'
               },
               { 
                   name : "BM30A",
                   sampleChangerType : 'FlexHCD'
               }                                             
            ]
         }
      }
   ]
};



