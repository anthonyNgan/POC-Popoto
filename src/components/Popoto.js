import './Popoto.css';
import * as d3 from 'd3';
import * as popoto from 'popoto';
import * as neo4j from 'neo4j-driver';
import React, { Component } from 'react';

class Popoto extends Component {

    componentDidMount() {
        this.popotoConfig();
    }

    popotoConfig() {
        // Demo Neo4j database settings hosted on GrapheneDb
        // popoto.rest.PROTOCOL = "https";
        // popoto.rest.HOST = "db-d0nijwvvx54p9aalxhmr.graphenedb.com";
        // popoto.rest.PORT = "24780";

        //neo4j://neo4j-core-b9dcbc7d-27.production-orch-0006.neo4j.io:7687

        // popoto.rest.AUTHORIZATION = "neo4j:5QcMcr8g_0LU3H33qjdRUjNqjdYIt2eXy0Xd7UN8Gaw";
        
        // popoto.rest.USERNAME = "neo4j";
        // popoto.rest.PASSWORD = "5QcMcr8g_0LU3H33qjdRUjNqjdYIt2eXy0Xd7UN8Gaw";
        

        //Game of thronesDB
        popoto.rest.CYPHER_URL = "https://db-d0nijwvvx54p9aalxhmr.graphenedb.com:24780/db/neo4j/tx/commit";
        // popoto.rest.AUTHORIZATION = "neo4j:db-d0nijwvvx54";

        popoto.rest.AUTHORIZATION = "Basic " + btoa("neo4j:db-d0nijwvvx54");

        //MovieDB
        // popoto.rest.CYPHER_URL = "https://db-kh9ct9ai1mqn6hz2itry.graphenedb.com:24780/db/data/transaction/commit";
        // popoto.rest.AUTHORIZATION = "Basic cG9wb3RvOmIuVlJZQVF2blZjV2tyLlRaYnpmTks5aHp6SHlTdXk=";

        popoto.rest.CONFIG = {trust: "TRUST_ALL_CERTIFICATES"};
        popoto.rest.WITH_CREDENTIALS = false;
        popoto.rest.ENCRYPTION = "ENCRYPTION_ON";
        
        // function createDriver(){
            
        //     return neo4j.driver(
        //         popoto.rest.PROTOCOL + "://" + popoto.rest.HOST + ":" + popoto.rest.PORT + "/db/neo4j/tx/commit",
        //         neo4j.auth.basic(popoto.rest.USERNAME, popoto.rest.PASSWORD),
        //         popoto.rest.CONFIG,
        //         popoto.rest.AUTHORIZATION = false
                
        //     );
        // }

        popoto.provider.node.Provider = {
            "Character": {
                "returnAttributes": ["name", "pagerank", "community"],
                "constraintAttribute": "name",
                "displayResults": function (pResultElmt) {
                    // Here D3.js mechanisms is used to generate HTML code.
                    // By default Popoto.js generates a <p> element for each result.
                    // pResultElmt parameter is the <p> element selected with D3.js
                    // So for "Person" result nodes two elements are generated:
                    // An <h3> element containing the person name
                    pResultElmt.append("h3")
                        .text(function (result) {
                            return result.attributes.name;
                        });
                }
            }
        };
        // Change the number of displayed results:
        popoto.result.RESULTS_PAGE_SIZE = 20;
        // Add a listener on returned result count to update count in page
        popoto.result.onTotalResultCount(function (count) {
            d3.select("#rescount").text(function (d) {
                return "(" + count + ")";
            })
        });
        // Add a listener on new relation added
        popoto.graph.on(popoto.graph.Events.GRAPH_NODE_RELATION_ADD, function (relations) {
            var newRelation = relations[0];
            // Collapse all expanded choose nodes first to avoid having value node in selection.
            popoto.graph.node.collapseAllNode();
            var linksToRemove = popoto.dataModel.links.filter(function (link) {
                // All other links starting from same source node except new one.
                return link !== newRelation && link.source === newRelation.source;
            });
            linksToRemove.forEach(function (link) {
                var willChangeResults = popoto.graph.node.removeNode(link.target);
                popoto.result.hasChanged = popoto.result.hasChanged || willChangeResults;
            });
            popoto.update();
        });
        // Start the generation using parameter as root label of the query.
        popoto.start("Character");
    }

    render() {

        return (
            <div>
                <section className="ppt-section-main">
                    <div className="ppt-section-header">
                        <span className="ppt-header-span">Proof of Concept - Game of Thrones DB</span>
                    </div>

                    <div id="popoto-graph" className="ppt-div-graph">
                    </div>

                    <div id="popoto-cypher" className="ppt-container-query">
                    </div>

                    <div className="ppt-section-header">
                        RESULTS <span id="rescount" className="ppt-count"></span>
                    </div>

                    <div id="popoto-results" className="ppt-container-results">
                    </div>

                </section>
            </div>
        )
    }
}

export default Popoto;