# ProduceRun [![Build Status](https://img.shields.io/travis/catarse/catarse.svg)](https://travis-ci.org/catarse/catarse) [![Coverage Status](https://img.shields.io/coveralls/catarse/catarse/channels.svg)](https://coveralls.io/r/catarse/catarse) [![Dependency Status](https://img.shields.io/gemnasium/catarse/catarse.svg)](https://gemnasium.com/catarse/catarse) [![Code Climate](https://img.shields.io/codeclimate/github/catarse/catarse.svg)](https://codeclimate.com/github/catarse/catarse)

The first opensource groupbuying platform

## An open source groupbuying platform for local food.

Welcome to ProduceRun's source code repository.
Our goal with opening the source code is to stimulate the creation of a community of developers around a high-quality groupbuying platform.

You can see the software in action in http://www.producerun.com
The official repo is https://github.com/producerun/producerun

## Getting started

### Dependencies

To run this project you need to have:

* Ruby 2.1.2
* [PostgreSQL](http://www.postgresql.org/)
  * OSX - [Postgress.app](http://postgresapp.com/)
  * Linux - `$ sudo apt-get install postgresql`
  * Windows - [PostgreSQL for Windows](http://www.postgresql.org/download/windows/)

  **IMPORTANT**: Make sure you have postgresql-contrib ([Aditional Modules](http://www.postgresql.org/docs/9.3/static/contrib.html)) installed on your system.

### Setup the project

* Clone the project

        $ git clone https://github.com/producerun/producerun.git

* Enter project folder

        $ cd producerun

* Create the `database.yml`

        $ cp config/database.sample.yml config/database.yml

    Add your datbase credentials

* Install the gems

        $ bundle install

* Create the database

        $ rake db:create db:migrate db:seed

If everything goes OK, you can now run the project!

### Running the project

```bash
$ rails server
```

Open [http://localhost:3000](http://localhost:3000)

### Translations

This repo is offered in only english at this stage

## Payment gateways

Currently, we support PayPal through our payment engines. Payment engines are extensions to ProduceRun that implement a specific payment gateway logic.
The current working engines are:
* Braintree
* 
Wanted payment gateways engines
*Paypal Express
*Dwolla for free transactions
*Coinbase for bitcoin


If you have created a different payment engine to ProduceRun please contact us so we can link your engine here.
If you want to create a payment engine please join our mailing list at https://groups.google.com/forum/?hl=en#!forum/groupbuyingdevs

## How to contribute with code

Before contributing, take a look at our Roadmap (https://www.pivotaltracker.com/projects/427075) and discuss your plans in our mailing list (https://groups.google.com/forum/?hl=en#!forum/groupbuyingdevs).

Our pivotal is concerned with user visible features using user stories. But we do have some features not visible to users that are planned such as:
* Turn ProduceRun into a Rails Engine with customizable views.
* Make a installer script to guide users through initial ProduceRun configuration.

After that, just fork the project, change what you want, and send us a pull request.

### Best practices (or how to get your pull request accepted faster)

* Follow this style guide: https://github.com/bbatsov/ruby-style-guide
* Create one acceptance tests for each scenario of the feature you are trying to implement.
* Create model and controller tests to keep 100% of code coverage at least in the new parts that you are writing.
* Feel free to add specs to the code that is already in the repository without the proper coverage ;)
* Regard the existing tests for a style guide, we try to use implicit spec subjects and lazy evaluation as often as we can.

## License

Copyright (c) 2015 ProduceRun, Inc

Licensed under the MIT license (see MIT-LICENSE file)
