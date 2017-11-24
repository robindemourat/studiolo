Inventaire - make an archive navigation webapp out of a gspreadsheet
===

Inventaire transforms a spreadsheet describing interconnected objects into an hypertext system allowing to navigate in it.

![screencast](https://github.com/robindemourat/inventaire/blob/master/screencast.gif?raw=true)

# Prepare your data

## Create a new google spreadsheet

## Set up spreadsheet tabs

In the google spreadsheet, set as much tabs as you have object types. Name the tabs with the name of the collections (examples: "works", "organizations", ...)

## Set up data headers

In each tabs, design the columns names. You have to comply to the following rules :

* each table must have an `id` field
* each table must have a name field ('title', 'name') which must be specified in the `config.json` file (defaults to french : 'titre', 'nom')

Make connections-related columns:

* each table *may* feature columns named after the name of an other tab. They must contain a list of ids separated by commas to point to the related objects (exemple: `my-organization-1, my-organization-2`). They will be used to make connections.
* each table *may* feature columns for derivated fields such as tags or authors, which must be specified in the `config.json` and will be extracted as simple objects from these fields and then merge as a new implicit collection (defaults to the following fields: 'tags', 'personnes').

Objects fields :

* each table *may* feature a optional `images` field accepts images urls separated by commas
* each table *may* feature a optional `description` field accepts text separated by commas
* each table *may* feature a optional `video` field accepts vimeo, youtube or html5 video url

## Write your data

Good to go ! now you can do the hard work - filling the actual data.

## Publish the spreadsheet

According to tabletop lib needs do the following :

* in your spreadsheet hit File > Publish on the web > Publish
* click on the "share" icon on the top right corner of the spreadsheet app and copy the share link. You will need it for the config file

# Install the app

```
git clone https://github.com/robindemourat/inventaire
cd inventaire
npm install
cp config.sample.json config.json

# Then fill your config
```

# Develop and finetune the app and your data

```
npm run dev
```

As long as you are in development mode, data is directly fetched from the google spreadsheet, which allows a lot of reactivity in data management.

# Deploy

The deploy script perenizes the data by fetching it and storing it locally, and bundles a build version of the app.

```
npm run build
```

FYI Builds hook does the following :

* fetch the spreadsheet and store it as a json file in the `data` folder
* fetch all images and store them in the `data` folder
* minify code and store it in `build` folder

Then the app is ready to upload wherever you want.

If you are into surge lightweight deployment, add a `CNAME` file with your domain and then :

```
npm run deploy
```





