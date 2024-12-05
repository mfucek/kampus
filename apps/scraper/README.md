# scraper

## Running the scraper

```bash
bun install
```

To run:

```bash
bun start
```

## Description

This project is a scraper for the [Kampus.hr](https://kampus.hr) platform. It is used to gather data about colleges, programs, subjects and professors.

## How it works

### List tool

The list tool is used to list all colleges available for scraping.

```bash
bun start list
```

### Scraper tool

The scraper is built using [Puppeteer](https://pptr.dev) and [Bun](https://bun.sh).

```bash
bun start scrape
```

Every college has its own driver that is responsible for scraping the data. The drivers are located in the `src/modules/driver` directory. Each driver outputs a the following data:

- Programs
- Professors
- Subjects

The data is linked together using the `externalLink` field.

The data is then saved to a JSON file in the `out` directory.

### CLI arguments

- `--college=<slug>`: Selects the college to scrape.
- `--limited`: Enables debug mode - limits the number of pages scraped for each program.
- `--full`: Scrapes the full college into the `out` directory.

## Importer tool

The importer tool is used to import the scraped data into the database.

```bash
bun start import
```

### CLI arguments

- `--production`: Imports the data into the production database.
- `--staging`: Imports the data into the staging database.

- `--college=<slug>`: Selects the college to import.
- `--input=<relative_path>`: Specifies the input directory.

To skip certain parts of the import process, the following flags can be used:

- `--skip-staff`: Skips importing staff.
- `--skip-subjects`: Skips importing subjects and linking them to staff.
- `--skip-programs`: Skips importing programs and linking them to subjects.
