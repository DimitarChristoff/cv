import React from 'react'
import { JobType } from './types'
import { Link } from '@mui/material'

export const jobs: JobType[] = [
  {
    client: 'Market Axess',
    role: 'Lead Software Engineer',
    location: 'London',
    from: 'Jun 2024',
    until: 'date',
    description: `Working as Lead on the platform team for MarketAxess. Huge monorepo running platform as a service on top of: pnpm,
    TypesScript, rtk, node, GraphQL, Yoga, Tailwind, ShadCN, ag-grid, MicroFrontends and much more. Responsible for helping build the
    next generation of platform for the Market Axess trading platform`,
  },

  {
    client: 'Norman & Sons',
    role: 'JavaScript Consultant',
    location: 'London',
    from: 'Jan 2020',
    until: 'May 2024',
    description: 'Working for a number of N&S clients within finance',
    jobs: [
      {
        client: 'HSBC Fixed Income / GDM, Falcon',
        from: 'Sep 2021',
        until: 'date',
        description: `Lead Front-end Developer on all Fixed Income risk apps (credit and rates), one of 5 UI platform
                  team devs / approvers in a repository of over 200 contributors. Previously, Senior Developer in a team
                  focused on 4 different trading and pricing apps within the Fixed Income space.
                  Created a "Spotlight" style command-line utility that enables traders to quickly create new CDS, IRS,
                  TRS or Bond based trades with Swagger, NLP and machine learning. Created a Trade Finder and a Bond
                  Position Finder (blotter like apps) with FDC3-based intents, allowing for results to be de-risked,
                  priced or inspected by other applications. Created an application discovery channel protocol, allowing
                  cross-application data flows. Created a new modern dark/light theme for all apps. This role required
                  work with POs, traders, UX / designers and quants.
                  Tech: React, Typescript, canvas, CSS Next, LESS, react-testing-library+Jest`,
      },
      {
        client: 'GenesisGlobal',
        from: 'Oct 2020',
        until: 'Sep 2021',
        description: (
          <>
            JavaScript developer / lead, initially working on Genesis' web components 'low code' platform for capital
            markets. Subsequently, extended to created two apps that allow users to make applications using a web
            interface without having to write code. Utilised json-schema, custom-elements.json and jsdoc to annotate
            both components and server-side standards and built a React redux app that{' '}
            <Link href="https://www.normanandsons.com/videos/IKZEOKR9YA.mp4">
              generated JSX code and managed projects
            </Link>{' '}
            in a WYSIWYG manner. Also used: BlueprintJs, react-flow, react-beautiful-dnd, styled-components, CSSNext,
            SCSS. Both server and client counterpart apps were completed within 6 months to a MVP standard to help
            Genesis offer low/no code solutions for server and client spaces.
          </>
        ),
      },

      {
        client: 'CITI',
        from: 'Jan 2020',
        until: 'Oct 2020',
        description: (
          <>
            JavaScript developer lead / architect on a project unifying 5 different silo-ed applications across Equities
            to work together under a common binary with interop FDC3 commands and common stylings. Challenging project
            on apps that have nothing in common (architecture / framework wise). Delivered working prototypes of the new
            architecture and proceeded to create shared styles for light and dark theme, update the apps and integrate
            them within Finsemble Electron binaries. Liaised with the UX/design team to deliver the best user experience
            possible with the least amount of friction for dev teams in terms of effort, code and changes in existing
            practices. Utilised React, CSSNext, Angular, Finsemble, ag-grid, devxtreme, Bootstrap.
          </>
        ),
      },
    ],
  },
  {
    client: 'GFT - Liquidnet',
    role: 'Frontend Lead, GIN IA',
    location: 'London',
    from: 'Jun 2019',
    until: 'Dec 2019',
    description: `JavaScript developer / architect on a new Greenfield project for trade intelligence in the space of Bloomberg
          and Refinitiv. Delivered a MVP in record time, unifying data from multiple APIs on top of a GraphQL layer,
          using React + hooks, apollo-graphql, MobX, Bulma, ECharts, Slickgrid, KeyCloak, Cypress, testing-library.
          DevOps via Bamboo / k8s / AWS`,
  },
  {
    client: 'NatWest Markets',
    role: 'Senior Application Developer, CurrencyPay',
    from: 'Apr 2018',
    until: 'Apr 2019',
    location: 'London',
    description: `JavaScript developer on a project allowing all RBS and NatWest corporate / business users to make
        international currency transfers on the back of the NatWest Markets FX rates platform. Utilising React,
        Babel, Lerna, Webpack, ES7, Jest, Enzyme, Redux, Bulma, SCSS / modules, GCP, GitLab CI, Docker, HELM, Google
        SSO, PingFed, DAON and more`,
    jobs: [
      {
        description: `Created a brand new responsive React component library for the whole project based upon Bulma and
        react-bulma-components, which is now strategic for forward dev work within NatWest Markets`,
      },
      {
        description: 'Migrated and converted the existing code base to use the new components across the suite of apps',
      },
      {
        description: `Helped migrate the whole project from closed off arch into an off-prem setup on top of Docker, Kubernetes,
        Google Cloud Platform, GitLab CI and to make it mobile friendly with multiple factors of authentication
        behind different SSO systems, effectively helping build a new platform`,
      },
    ],
  },
  {
    client: 'RBS',
    role: 'Senior Developer, DES/Platform UI',
    from: 'Sep 2016',
    until: 'Feb 2018',
    location: 'London',
    description: `Part of Platform Services under DES, responsible for architecture, development and support of in-house Web Component library development, using React, Babel, Webpack, ES6, PostCSS, CSSNext, Jest, Enzyme`,
    jobs: [
      {
        description: `Ulster Bank - GreenBank API Portal application, complete development and UI codebase, using React, Babel, Webpack, ES6, SCSS, mobx, redux`,
      },
      { description: `CPB Payment / transfer portal, built validation and form generation framework for React` },
      {
        description: `OpenBanking initiative apps developer over multiple brands (NatWest, RBS, UlsterBank), helped create the retail, corporate and internal management tooling for facilitating OpenBanking payments. Stack primarily React, RxJS, Immutable.js`,
      },
    ],
  },
  {
    client: 'GFT',
    role: 'Senior Developer',
    from: 'Jun 2016',
    until: 'Sep 2016',
    location: 'London',
    description: `Onsite consultant at client banks`,
    jobs: [
      {
        client: 'Deutsche Bank - KRAFT',
        description: `Prototyping and POCs for converting codebase from Angular 1.x to React and running React within Angular`,
      },
      {
        description: `Grid optimisations and development of a ES6 port of SlickGrid without jQueryUI, performance driven, conversion and replacement of ng-grid systems to Slickgrid.`,
      },
    ],
  },
  {
    client: 'Adaptive',
    role: 'Senior JavaScript Consultant',
    location: 'London',
    from: 'Oct 2015',
    until: 'Apr 2016',
    description: 'In-house and onsite development',
    jobs: [
      {
        description: `Work on automated user capture and recognition, using React and ID scanners`,
        client: 'Deutsche Bank',
      },
      {
        description: `Consulting on-site as part of bootstrapping of a new MIFID-2 application to capture sales workflow. Using ReactJS, Babel, RxJs, node.js, ag-grid, SlickGrid and much more`,
        client: `Bank of America Merrill Lynch`,
      },
      {
        description: `Developing on the company's new OSS release of their Reactive Trader sales tool demo, utilising React, Babel, Webpack, RxJs, d3, as well as some MIFID-2 demo apps for Tier 2 banks`,
        client: 'Adaptive internal',
      },
    ],
  },
  {
    client: 'Morgan Stanley',
    location: '20 Bank St, London',
    role: 'Senior JavaScript Consultant',
    from: 'Feb 2015',
    until: ' Oct 2015',
    description: `Working as lead UI developer a new bond analytics application for the Structured Products Group (SPG), built on top of AngularJS, RequireJS and a host of open source micro libraries like Slickgrid, Highcharts, D3, Bootstrap and many more.`,
  },
  {
    client: 'J.P. Morgan, Chase & Co (JPMC)',
    role: 'Senior JavaScript Engineer',
    from: 'Apr 2014',
    until: 'Dec 2014',
    location: '25 Bank Street, London',
    description:
      'Working on a research and commentary portal for JPM Markets / Equities, built on top of AngularJS, RequireJS, multiple Bower component architecture and submodules with Node.JS tooling and Grunt.js work flows',
    jobs: [
      {
        description: `Creation of the JPMM HTML5 theme, converting bank styles and conceptual components from Flex to HTML5 on top of Bootstrap and LESS`,
      },
      {
        description: `Creation of core connectivity services for consumption of REST APIs`,
      },
      {
        description: `Creation of 'live' documentation system with executable code, training videos, writing Yeoman app and sub-generators`,
      },
      {
        description: `Creation of a Private Bower server for Node.JS`,
      },
      {
        description: `Creation of the HTML5 team's microsite via Node.JS, express, .ejs`,
      },
      {
        description: `Running a multi browser / platform application environment with support for desktop OpenFin desktop applications, chrome wrapping and skinning`,
      },
    ],
  },
  {
    client: 'Thomson Reuters',
    from: 'Sep 2013',
    until: 'Dec 2013',
    role: 'Senior Web Developer',
    location: 'London',
    description: `Working on a modular app for risk management, written in Dojo. AMD modules, less, promises, sockets.
                  Creating build flows and developer work flows via Grunt.js, replacing maven / ant`,
  },
  {
    client: 'Rule Financial',
    from: 'Nov 2012',
    until: 'Sep 2013',
    role: 'Javascript Consultant',
    location: 'London',
    description: 'Worked as a consultant for several banks as well as on internal Rule projects',
    jobs: [
      {
        client: 'Deutsche Bank - Horizon',
        description: `Consulted as Senior Platform JavaScript Developer on DB's award-winning product Horizon. Primary
                    focus on creation of a build-able versioned component library of Web Modules, consisting of
                    JavasScript, mark-up/templates, images and SVG assets. Created a builder system through node.js,
                    using RequireJS optimizer and automatic documentation generation from markdown, including live
                    editable examples. Builds can now be consumed either as stand-alone applications or under OSGI /
                    Smart GWT wrappers. Involved in the refactoring existing code and introducing new practices like
                     responsive design / media queries, better CSS / LESS modules, vendor-less CSS3 implementation and
                     a better event-driven MVC/MVVM implementation under Backbone.js. Headless continuous integration
                     through CasperJS/PhantomJS.`,
      },
      {
        client: 'Rule Financial',
        description: `Created a prototype low latency HTML5 currency trading app with tear-offs, desktop application
                      building under node-webkit on top of a fully RESTful nodejs backend (via SailsJS) with socket.io
                      support. App runs concurrently on any device from iPhone to browser in a responsive way, has
                      touch support/gestures and charting modules.`,
      },
      {
        client: 'HSBC',
        description: `Consulting (including off-shore in China) at HSBC (FX/Evolve) on building their next generation
                      HTML5 FX trading platform, covering mentoring & best practices, tooling, bootstrapping, code
                      review, performance and more. Stack used: Yeoman, Bower, AngularJS, grunt.js, prime, Karma,
                      jasmine, protractor`,
      },
    ],
  },
]
