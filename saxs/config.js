var ExtISPyB ={
   version : 'alpha-u1',
   release_date : '2017/02/07',

   sites:[
      {
         name:'ESRF',
 	     description : 'European Synchroton Radiation Facility',
         icon : '../images/site/esrf.png',
         url:'https://wwws.esrf.fr/ispyb/ispyb-ws/rest',
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
	     plateGroup : [
			{
				type: 'Deep Well',
				rowCount : 8,
				columnCount : 12
			},
			{
				type: '4 x ( 8 + 3 ) Block',
				rowCount : 4,
				columnCount : 11
			},
			{
				type: '96 Well plate',
				rowCount : 8,
				columnCount : 12
			}

	],
         beamlines:{
            SAXS:[
		 {
		   name : 'BM29',
		   sampleChangerType : ''
   	       }
            ],
            MX:[ ]
         }
      },
      {
          name:'ESRF TEST',
         url:'http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest',
 	     description : 'European Synchroton Radiation Facility',
         icon : '../images/site/esrf.png',
        
         exiUrl:'http://pc593.embl.fr:8080/extispyb-ws/rest',
	     plateGroup : [
			{
				type: 'Deep Well',
				rowCount : 8,
				columnCount : 12
			},
			{
				type: '4 x ( 8 + 3 ) Block',
				rowCount : 4,
				columnCount : 11
			},
			{
				type: '96 Well plate',
				rowCount : 8,
				columnCount : 12
			}

	],
         beamlines:{
            SAXS:[
		 {
		   name : 'BM29',
		   sampleChangerType : ''
   	       }
            ],
            MX:[ ]
         }
      }

   ]
};
