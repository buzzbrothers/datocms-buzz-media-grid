# DatoCMS Plugin Buzz Media Grid

This plugin allows you to create some grids with customizable columns and rows count in which you can then draw areas in which to put media (image or video).

- [DatoCMS Plugin Buzz Media Grid](#datocms-plugin-buzz-media-grid)
  - [Features](#features)
  - [Usage](#usage)
  - [JSON output](#json-output)

![DatoCMS Plugin Buzz Media Grid Preview](./docs/datocms-plugin-buzz-media-grid-preview.webp)

## Features

1. Customizable grid size
2. Easy area selection (click & drag)
3. Integrated with Dato media selector

## Usage

To create a media grid, simply follow these steps:

1. Add a `JSON` field
2. Under `Presentation`, choose `Media grid`
3. Update the columns and rows count if wanted
4. Click on `Save field`

![DatoCMS Plugin Buzz Media Grid Configuration](./docs/datocms-plugin-buzz-media-grid-configuration.webp)

## JSON output

The output of this plugin is a simple JSON that is structured like so:

```json
{
  "columns": 6, // count of columns
  "rows": 6, // count of rows
  "areas": [
    {
      // a UUID for your area
      "id": "573921d1-974b-4ecb-bbfb-dc7e9fad9add",
      // {startColumn}, {startRow}, {endColumn}, {endRow}
      "position": [0, 0, 2, 3],
      // content (image or video) with url
      "content": {
        "type": "image",
        "url": "https://..."
      }
    },
    {
      // etc...
    }
  ]
}
```
