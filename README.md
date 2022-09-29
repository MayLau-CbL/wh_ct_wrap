# HK Complusory Covid-19 Test Data Wrapper
This is part of the HK Complusory Reminder project.

## Purpose
This is data wrapper for the HK Complusory Reminder project. Later, a web and mobile platform will be available for searching with keywords or active notify [mobile only] when specific place is annouced on the pdf.

## What's done
Using pdf_parsor to parse the annouced [latest complusory notice](https://www.chp.gov.hk/files/pdf/ctn.pdf) to the supabase database with GitHub Action scheduled every night 2200 (+0800). Axios for network request.







