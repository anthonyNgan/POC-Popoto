import './Popoto.css';
import * as popoto from 'popoto';
import React, { Component } from 'react';

class Popoto extends Component {

    componentDidMount() {
        this.popotoConfig();
    }

    popotoConfig() {
        //Game of thronesDB
        popoto.rest.CYPHER_URL = "https://db-d0nijwvvx54p9aalxhmr.graphenedb.com:24780/db/neo4j/tx/commit";
        popoto.rest.AUTHORIZATION = "Basic " + btoa("neo4j:db-d0nijwvvx54");

        //MovieDB
        // popoto.rest.CYPHER_URL = "https://db-kh9ct9ai1mqn6hz2itry.graphenedb.com:24780/db/data/transaction/commit";
        // popoto.rest.AUTHORIZATION = "Basic cG9wb3RvOmIuVlJZQVF2blZjV2tyLlRaYnpmTks5aHp6SHlTdXk=";

        popoto.rest.CONFIG = {trust: "TRUST_ALL_CERTIFICATES"};
        popoto.rest.WITH_CREDENTIALS = false;
        popoto.rest.ENCRYPTION = "ENCRYPTION_ON";
        

        popoto.provider.node.Provider = {
            "Character": {
                "returnAttributes": ["name", "pagerank", "community"],
                "constraintAttribute": "name",
                // "autoExpandRelations": true, // if set to true Person nodes will be automatically expanded in graph
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
            document.getElementById("result-total-count").innerHTML = "(" + count + ")";
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
                <section class="ppt-section-main">
    <div class="ppt-section-header">
        <span class="ppt-header-span">Graph</span> search
    </div>

    <div class="ppt-container-graph">
        <nav id="popoto-taxonomy" class="ppt-taxo-nav">
        </nav>
        <div id="popoto-graph" class="ppt-div-graph">
        </div>
    </div>

    <div id="popoto-query" class="ppt-container-query">
    </div>

    <div id="popoto-cypher" class="ppt-container-cypher">
    </div>

    <div class="ppt-section-header">
        RESULTS <span id="result-total-count" class="ppt-count"></span>
    </div>

    <div id="popoto-results" class="ppt-container-results">
    </div>

</section>
            </div>
        )
    }
}

export default Popoto;