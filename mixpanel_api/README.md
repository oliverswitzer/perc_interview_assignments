# Mixpanel API Raw Data --> CSV 

This is a project done in node to convert Mixpanel's raw data dump into a csv file.

You can either query all events over the time period from 2014-01-01 to 2014-03-10, or filter by a specific type of event by passing in the event as a string as a command line argument.

Example: 

`$ node mixpanel_export.js 'form submit'`

This will return all events of type form submit. 

The csv file is output to the same directory as eventOutput.csv.
