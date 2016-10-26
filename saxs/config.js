var ExtISPyB ={
   version : '0.9.1',
   release_date : '2016/10/05',   

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
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
         beamlines:{
            SAXS:[
               'BM29'
            ],
            MX:[ ]
         }
      },
      {
         name:'ESRF TEST',
         url:'http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest',
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
         beamlines:{
            SAXS:[
               'BM29'
            ],
            MX:[
               
            ]
         }
      },
      {
         name:'EMBL TEST',
         url:'http://ispyb-test.embl-hamburg.de:8080/ispyb/ispyb-ws/rest',
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
         beamlines:{
            SAXS:[
               'P12'
            ],
            MX:[
               'P13','P14'
            ]
         }
      },
      {
         name:'EMBL',
         url:'http://192.109.31.39/ispyb/ispyb-ws/rest',
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
         beamlines:{
            SAXS:[
               'P12'
            ],
            MX:[
               'P13','P14'
            ]
         }
      },
      {
         name:'Alex',
         url:'http://lindemaria:8080/ispyb/ispyb-ws/rest',
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest'
      },
      {
         name:'Local',
         url:'http://localhost:8080/ispyb/ispyb-ws/rest',
         exiUrl:'http://localhost:8080/extispyb-ws/rest',
		         beamlines:{
            SAXS:[
               'BM29'
            ],
            MX:[
               "ID23-1","ID29","ID30B","ID23-2","ID30A-3","ID30A-1","ID30A-2","BM14U","BM30A","ID14-1","ID14-2","ID14-3","ID14-4"
            ]
         }
      }
   ]
};
