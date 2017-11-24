Inventaire - make an archive navigation webapp out of a gspreadsheet
===

Inventaire transforms 


# Prepare your data

## Set up spreadsheet tabs

In a google spreadsheet, set as much tabs as you have object types. Name the tabs with the name of the collections (examples: "works", "organizations", ...)

## Set up data headers

You have to comply to the following rules :

* each table must have an `id` field and a unique identifier
* each table must have a name field ('title', 'name') which must be specified in the `config.json` file

Make connections:

* each table *may* feature columns named after the name of an other tab. They must contain a list of ids separated by commas to point to the related objects (exemple: `my-organization-1, my-organization-2`)
* each table *may* feature columns for derivated fields such as tags or authors, which must be specified in the `config.json` and will be extracted as simple objects from these fields and then merge as a new implicit collection.

Document objects :

* each table *may* feature a optional `images` field accepts images urls separated by commas
* each table *may* feature a optional `description` field accepts text separated by commas
* each table *may* feature a optional `video` field accepts vimeo, youtube or html5 video url

## Write your data

Once

# Develop

```
git clone https://github.com/robindemourat/inventaire
cd inventaire
npm install
cp config.sample.json config.json

# Then fill your config

npm run dev
```

As long as you are in development mode, data is directly fetched from the google spreadsheet.

# Deploy

```
npm run build
```

Builds hook does the following :

* fetch the spreadsheet and store it as a json file in the `data` folder
* fetch all images and store them in the `data` folder
* minify code and store it in `build` folder

The app is ready to upload wherever you want.

If you are into surge lightweight deployment, add a `CNAME` file with your domain and then :

```
npm run deploy
```





