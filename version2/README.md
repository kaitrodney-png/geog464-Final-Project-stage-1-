# GEOG 464 Final Project: Mammal Populations ans traffic distribution in Quebec 

Link: https://kaitrodney-png.github.io/geog464-Final-Project-stage-1-/version2/site/ 

## A1: Project desription 
    **Problem:** Identify potenital areeas of vulnerability amongst Caribou polulations in Quebec 
    **Audience:** Wildlife management
    **Core action:** Filter through Caribou habitats/populations to identify key ares of importance in terms of urban planning
    **Boundary:** Will not identify areas to implment new measures or wildlife control ony indentify areas of interst 
    **Data:** Disturbance data and wildlife habits of different Caribou species in Quebec

 ## A3 feature: Navigating the buffer and Natural disturbances 
For A3 I will add natural disturbances and the buffer to my map so that my reader can understand the greater extend of disturbances.
It has depth because it brings in a new layer of complexity to the view. 
I will know it works when both can be naivated easily.
My edge case is ...


## AI DISCOURSE:

    I had a bit of a funky AI process for my assignment I started off using the Git chat in VS code, it quickly went astray and would not connect for me for a while. During this time I reverted to Chat GPT (the free version) this was very difficult as it was not attached to my project so I had to be very descriptive and persise in terms of what I was asking it for. I was using it to help me figure out how it would be best to sort through my data with my initial data set. It was extremly large and Chat helped me write the code to shrink it down in a safe and lossless way. It was a lot of trial and error as well as corecting CHAT till I got to where I felt good. 
    Once I got my Copilot working again I switced back to there. I then used it to alter recipee 3 provided by the prof to be more project specific to what I was looking for.
    I had asked it to help me add the code in to alter the names of the columns in order for it to go through to the final project. It at first gave me the code that I read through and then like personalized to the names I wanted. I also used it to learn how to add my second base data set. I knew I could add both but I could not quite figure out how to go about it. Initially it told me to do them both simutaiusly, but i didnt really like this approach. In recent programming classes I took I found it was much easier to tackle one thing at a time and get it working before adding the other one.
    I then used Copilot again in my app.js to learn how to put in both data sets at the same time as well as have them toggle. I did this step-by-step as it initially wanted to redo everything so that way I can understand what was happening. I had it break down all the sequences that it was giving me and explain them and then through kind of back and forth changed it to where I wanted it to be. I tested it by going back and forth between the live site and the java script page to see where things where changing and what the results were. I think I did keep most of what it suggested I did get ride of some of the fancy feaures it was trying to add to my 2 data set layers as I felt they werent needed for the time being and as I have a very basic understanding of coding I didnt want to over complicate it. 

## Data information 

**DATA SET 1**
    **Title:** Aires de répartition des populations locales de caribous des bois, écotype forestier, au Québec
    **Publisher:** Ministry of the Environment, the Fight Against Climate Change, Wildlife and Parks
    **Link:** https://www.donneesquebec.ca/recherche/dataset/aires-de-repartition-des-populations-de-caribous-forestier
    **Licence:**  Attribution (CC-BY 4.0)
    **Date Accessed:** Sept 14th 2026
    **What was Changed:** Several columns were removed from the simplified data such as EO_ID, OTHER_NM, EOTYPE, METHOD as well as the column names that were kept were changed to make navigation eassier. NOM_POP = Local_Pop_Name, NOM_FRANCA = name_fr, NOM_ANGLA = name_eng, NOM_SCIEN = name_sci, Rang_S = Level_of_Stability, LEMV = status, Tempo = Years_of_Study, Sup_KM2 = area_km2, Sup_HA = area_ha, DATE_MAJ = date_updated
    **Before Count:** 15
    **After Count:** 15
    **The System Converted from:** The distribution area data are recorded according to the projected coordinate system Quebec Lambert (EPSG: 32198).


**DATA SET 2**
    **Title:** Aire de répartition de la population locale de caribous des bois, écotype montagnard, population de la Gaspésie
    **Publisher:** Ministry of the Environment, the Fight Against Climate Change, Wildlife and Parks
    **Link:** https://www.donneesquebec.ca/recherche/dataset/aire-de-repartition-caribous-montagnard-gaspesie 
    **Licence:**  Attribution (CC-BY 4.0)
    **Date Accessed:** Oct 18th 2026
    **What was Changed:** Several columns were removed from the simplified data such as EO_ID, OTHER_NM, EOTYPE, METHOD as well as the column names that were kept were changed to make navigation eassier. NOM_POP = Local_Pop_Name, NOM_FRANCA = name_fr, NOM_ANGLA = name_eng, NOM_SCIEN = name_sci, Rang_S = Level_of_Stability, LEMV = status, Tempo = Years_of_Study, Sup_KM2 = area_km2, Sup_HA = area_ha, DATE_MAJ = date_updated
    **Before Count:** 1
    **After Count:** 
    **The System Converted from:** The distribution area data are recorded according to the projected coordinate system Quebec Lambert (EPSG: 32198).
    **IMPORTANT INFORMATION** Information regarding this data and for all further inquires the main source is asked to be given with the data 
        Lesmerises, F. and M.-H. St-Laurent. 2018. Influence of habitat disturbance rate, regional coyote abundance and predator control on the demographic parameters of the Gaspé-Atlantic caribou population. Scientific report submitted to Environment Canada – Canadian Wildlife Service, Rimouski, Quebec. 22 p. + 8 appendices


 **DATA SET 3**
    **Title:** Anthropogenic disturbance footprint within boreal caribou ranges across Canada 
    **Publisher:** Government of Canada; Environment and Climate Change Canada
    **Link:**https://data-donnees.az.ec.gc.ca/data/species/developplans/anthropogenic-disturbance-footprint-within-boreal-caribou-ranges-across-canada-as-interpreted-from-2008-2010-Landsat-satellite-imagery-Updated-to-2012-range-boundaries)?lang=en  
    **Licence:**  Open Government Licence - Canada
    **Date Accessed:** NOV 3th 2026
    **What was Changed:** I downloaded only the quebec content, then I broke it down into seperate layers which were each treated individually in all of them the majority of collumns were removed to simplify the data: 

        For the Quebec2020 data set I removed overlapping areas and boundaries within the other data sets that were within the other data sets, I also seperated the cutblocks data into its own file to make it more managable. 
            Original Quebec features: 22783
            Remaining Quebec features: 22777
            Area removed: 229306.68899456185

        For the buffer area the overlapping areas were removed :


        For the Fire layer that was created, I removed the overlapping areas and boundaries from the other data sets:
            Original Fire features: 6
            Remaining Fire features: 6
            Original area coverage 211667532266.19748
            Remaining area coverage 104683198515.56712
            

A good prompt pattern to use for your AI:

I am adapting a GEOG 464 MVP.

Goal: [one small behaviour]
File: [name the file if I know it]
Do not change: [boundary]

Before editing:
1. tell me where the current behaviour lives;
2. explain the smallest change;
3. show me the diff.

After I approve it, I will test: [specific observable test].


Things to do .
- convert the data and turn it into Geojsons
- get ride of toggle between the species (make them always present on the map)
- highlight the boundaries of the ones with extra information 
- do a legend 
- Add a toggle for polygon disturbances.
- Add a toggle for linear disturbances.
- Add a toggle for anthropogenic disturbances with the 500 m buffer.
-  Add a toggle for anthropogenic disturbances with the 500 m buffer and fire.
-  Make sure the disturbance layers are visually distinguishable from the population boundaries.
- Clean up popups with relevant population information.
- Explain what each disturbance layer represents.

Git code to save it:
#git status
#git add .
#git commit -m "what you changed, in a few words"
#git push

to go back to the last version that worked 
#git restore site/app.js 