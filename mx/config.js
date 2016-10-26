var ExtISPyB ={
   version : '0.9.1',
   release_date : '2016/10/05',
   
   spaceGroups : ["P1","P2","P21","C2","P21212","P212121","P222","P2221","C222",
                    "C2221","I212121","I222","F222","P4","P41","P41212","P4122","P42","P4212","P422",
                    "P42212","P4222","P43","P43212","P4322","I4","I41","I4122","I422","P3","P31",
                    "P3112","P312","P3121","P32","P321","P3212","P3221","P6","P61","P6122","P62",
                    "P622","P6222","P63","P6322","P64","P6422","P65","P6522","P213","P23","P4132",
                    "P4232","P432","P4332","I213","I23","I4132","I432","F23","F4132","F432","R3","R32"],   
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
         url:'https://wwws.esrf.fr/ispyb/ispyb-ws/rest',
         exiUrl:'https://wwws.esrf.fr/ispyb/ispyb-ws/rest',
         beamlines:{
            SAXS:[
               'BM29'
            ],
            MX:[
               "ID23-1","ID23-2","ID29","ID30A-1","ID30A-2","ID30A-3","ID30B","BM14U","BM30A"
            ]
         }
      },
      {
         name:'EMBL',
         url:'http://ispyb.embl-hamburg.de/ispyb/ispyb-ws/rest',
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
         beamlines:{
            SAXS:[
               'P12'
            ],
            MX:[
               "P13", "P14"
            ]
         }
      },
      {
         name:'ESRF TEST',
         url:'http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest',
         // exiUrl:'http://lindemaria:8080/extispyb-ws/rest',
		 exiUrl:'http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest',
         beamlines:{
            SAXS:[
               'BM29'
            ],
            MX:[
               "ID23-1","ID23-2","ID29","ID30A-1","ID30A-2","ID30A-3","ID30B","BM14U","BM30A"
            ]
         }
      },
	  {
         name:'LOCAL (only for developers)',
         url:'http://localhost:8080/ispyb/ispyb-ws/rest',
         exiUrl:'http://localhost:8080/ispyb/ispyb-ws/rest',
         beamlines:{
            SAXS:[
               'BM29'
            ],
            MX:[
               "ID23-1","ID23-2","ID29","ID30A-1","ID30A-2","ID30A-3","ID30B","BM14U","BM30A"
            ]
         }
      }
   ]
};



