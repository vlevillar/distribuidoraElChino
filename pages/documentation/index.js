/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';
import { CodeHighlight } from '../../demo/components/CodeHighlight';

const Documentation = () => {
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card docs">
                        <h4>Current Version</h4>
                        <p>React 17.x and PrimeReact 7.x</p>

                        <h5>Getting Started</h5>
                        <p>
                            Sakai is an application template for React based on the popular <a href="https://nextjs.org/" className="font-medium hover:underline">NextJS</a> framework. To get started, clone the <a href="https://github.com/primefaces/sakai-react-next" className="font-medium hover:underline">repository</a> from 
                            GitHub and install the dependencies with npm or yarn.
                        </p>
                        <CodeHighlight>
                        {`
"npm install" or "yarn"
`}
                        </CodeHighlight>

                        <p>
                            Next step is running the application using the start script and navigate to <b>http://localhost:3000/</b> to view the application. That is it, you may now start with the development of your application using the Sakai
                            template.
                        </p>

                        <CodeHighlight>
                        {`
"npm run dev" or "yarn dev"
`}
                        </CodeHighlight>

                        <h5>Dependencies</h5>
                        <p>Dependencies of Sakai are listed below and needs to be defined at package.json.</p>

                        <CodeHighlight lang="js">
                        {`
"primereact": "...",                    //required: PrimeReact components
"primeicons": "...",                    //required: Icons
"primeflex": "...",                     //required: Utility CSS classes
"react-transition-group": "^4.4.1",     //required: PrimeReact animations
`}
                        </CodeHighlight>

                        <h5>Structure</h5>
                        <p>Sakai consists of a couple folders, demos and core has been separated so that you can easily remove what is not necessary for your application.</p>
                        <ul class="line-height-3">
                            <li><span class="text-primary font-medium">layout</span>: Main layout files, needs to be present</li>
                            <li><span class="text-primary font-medium">demo</span>: Contains demo related utilities and helpers</li>
                            <li><span class="text-primary font-medium">pages</span>: Demo pages</li>
                            <li><span class="text-primary font-medium">public/demo</span>: Assets used in demos</li>
                            <li><span class="text-primary font-medium">public/layout</span>: Assets used in layout such as logo</li>
                            <li><span class="text-primary font-medium">styles/demo</span>: CSS files only used in demos</li>
                            <li><span class="text-primary font-medium">styles/layout</span>: SCSS files of the core layout</li>
                        </ul>

                        <h5>Integration with Existing NextJS Applications</h5>
                        <p>Only the folders that are related to the layout needs to move in to your project.</p>
                        <ul class="line-height-3">
                            <li>Copy <span class="text-primary font-medium">./layout</span> folder to the root of your application.</li> 
                            <li>Copy <span class="text-primary font-medium">./styles/layout</span> folder to the styles folder in your application.</li> 
                            <li>Move <span class="text-primary font-medium">./public/layout</span> and <span class="text-primary font-medium">./public/layout/themes</span> to the public folder in your application.</li> 
                            <li>Move <span class="text-primary font-medium">./pages/_document.js</span> to the pages folder in your application.</li>
                            <li>Open <span class="text-primary font-medium">./pages/_app.js</span>, import the required css files and change the rendering part to use the layout.</li>
                        </ul>
                        <CodeHighlight lang="js">
                        {`
import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return (
            <LayoutProvider>
                {Component.getLayout(<Component {...pageProps} />)}
            </LayoutProvider>
        )
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}
`}
                        </CodeHighlight>

                        <h5>PrimeReact Theme</h5>
                        <p>
                            Sakai theming is based on the PrimeReact theme being used. Default theme is <b>lara-light-indigo</b>.
                        </p>

                        <h5>SASS Variables</h5>
                        <p>
                            In case you&apos;d like to customize the main layout variables, open <b>_variables.scss</b> file under src/layout folder. Saving the changes will be reflected instantly at your browser.
                        </p>

                        <h6>src/layout/_variables.scss</h6>
                        <CodeHighlight lang="scss">
                        {`
/* General */
$scale:14px;                    /* initial font size */ 
$borderRadius:12px;             /* border radius of layout element e.g. card, sidebar */ 
$transitionDuration:.2s;        /* transition duration of layout elements e.g. sidebar */ 
`}
                        </CodeHighlight>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Documentation;
