/**
 * Created by C on 2017-09-01.
 */

/**
 * @file
 */
(function () {

  "use strict";

  Vue.component('TableComponent',{
    props:['thead','tbody'],
    methods:{
      updateParentSortUp(val){
        this.$emit('updateParentSortUp',val);
      },
      updateParentSortDown(val){
        this.$emit('updateParentSortDown',val);
      }
    },
    template:` 
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <div class="table-responsive">
                <table class="table table-striped" id="table">
                  <thead>
                    <tr>
                      <th v-for="object in thead" width="25%">
                        <div>
                          <p class="table-header">{{object}}</p>
                           <button v-on:click="updateParentSortUp(object)" class="sortUp">
                              <i class="fa fa-angle-up" aria-hidden="true"></i>
                            </button>
                            <button v-on:click="updateParentSortDown(object)" class="sortDown">
                              <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="object in tbody">
                      <td v-for="item in object">{{item}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>`
  });

  Vue.component('navbar',{
    props:['numberOfRows'],
    data:function (){
      return{
        search:'',
        filter:[],
        displayNumber:10,
        loaded:true
      }
    },
    created:function () {
      new Clipboard('.copy-btn');
    },
    template:`<div class="container">
                <div class="row">
                  <div class="col-xs-12 ">
                  
                    <div class="right-nav excel-copy-group">
                      <button class="btn btn-success" v-on:click="downloadExcel" id="downloadExcel">Excel</button>
                      <button class="btn copy-btn btn-info" data-clipboard-target="#table">Copy Table</button>
                    </div>
                  </div>
                
                  <div class="form-inline">
                    <div class="form-group">
                      <select v-model="displayNumber" id="displayNumberInput" class="form-control">
                        <option value="10">Show 10</option>
                        <option value="25">Show 25</option>
                        <option value="50">Show 50</option>
                        <option v-bind:value=numberOfRows v-if="search === ''">Show All</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <input v-model="search" placeholder="Search" class="form-control">
                    </div>
                    
                    <div class="form-group right-nav">
                      <button class="btn btn-default" v-on:click="showModal">
                        SHOW/HIDE VARIABLES 
                        <i class="fa fa-cog" aria-hidden="true"></i>
                      </button>
                    </div>
                    
                  </div>    
                </div>
              </div>`,
    methods:{
      downloadExcel:function () {
        this.$emit('parentDownloadExcel');
      },
      showModal:function(){
        this.$emit('parentShowModal');
      }
    },
    watch:{
      search:function (val) {
        this.$emit('updateParentSearch',val);
      },
      displayNumber:function (val) {
        this.$emit('updateParentDisplayNumber',val);
      }
    }
  });

  Vue.component('modal', {
    props:['filter','keys'],
    watch:{
      filter:function (val) {
        this.$emit('updateParentFilter',val);
      }
    },
    template: `<transition name="modal">
                <div class="modal-mask">
                  <div class="modal-wrapper">
                    <div class="modal-container">
            
                      <div class="modal-header">
                          <h3>Filter</h3>
                          <button class="modal-default-button btn btn-primary" @click="$emit('close')">
                            OK
                          </button>
                      </div>
            
                      <div class="modal-body">
                          <div class="filterWrapper" v-for="object in keys">
                            <div class="row" >
                            
                              <div class="col-xs-4">
                                  <p class="filter-label">{{object}}</p>
                              </div>
                              
                              <div class="col-xs-5 col-xs-offset-3">
                                <label class="switch">
                                   <input type="checkbox" v-bind:value="object" v-model="filter">
                                  <span class="slider round"></span>
                                </label>
                              </div>
                              
                            </div>
                          </div>
                      </div>
            
                      <div class="modal-footer">
                        <slot name="footer">
                        </slot>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </transition>`
  });

  Vue.component('navbar-footer',{
    props:['startNumber','displayNumber','numberOfRows','numberOfTabs'],
    data:function () {
      return{
        paginationStart:1
      }
    },
    methods:{
      increaseStartNumber:function () {
        if(this.startNumber + this.displayNumber < this.numberOfRows){
          this.$emit("parentIncreaseStartNumber",this.displayNumber);
          this.paginationStart += 1;
        }
      },
      decreaseStartNumber:function () {
        if(this.startNumber - this.displayNumber >= 0){
          this.$emit("parentDecreaseStartNumber",this.displayNumber);
          this.paginationStart -= 1;
        }
      },
      updatePaginationStart:function (number) {
        this.paginationStart = number;
        this.$emit("parentUpdateStartNumber",(this.paginationStart-1) * this.displayNumber);
      },
      buttonIsActive:function (number) {
        return number === this.paginationStart;
      }
    },
    computed:{
      prettyDisplayNumber:function () {
        if(this.startNumber + this.displayNumber > this.numberOfRows){
          return this.numberOfRows;
        }
        return this.startNumber + this.displayNumber;
      },
      paginationNumbers:function () {
        var start = this.paginationStart;
        var end = this.numberOfTabs;
        var returnArray = [];


        if(start <= 3 && end > 5){ // beginning of pagination when there's more than 5 tabs
          return [1, 2, 3, 4, 5];
        }

        else if(start > end-2 && end > 5){ // end of pagination when there's more than 5 tabs
          return [end - 4, end-3, end-2, end-1,end];
        }

        else if (end > 5){  // middle of pagination when there's more than 5 tabs
          return [start - 2, start-1, start, start+1,start+2];
        }

        else{  // pagination when there's less than 5 tabs
          for(var i=1 ; i <= end; i++){
            returnArray[i-1] = i;
          }
          return returnArray;
        }

      }
    },
    template:`<div class="container">
                <div class="row">
                  <div class="col-xs-6">
                    <p>Showing {{prettyDisplayNumber}} of {{numberOfRows}}</p>
                  </div>
                  <div class="col-xs-6">
                    <div class="btn-group pagination" role="group" >
                      <button v-on:click="decreaseStartNumber" class="btn btn-default">Previous</button>
                      <button v-for="number in paginationNumbers" v-on:click="updatePaginationStart(number)" 
                        class="btn btn-default" v-bind:class="{'active': buttonIsActive(number)}">
                      {{number}}
                      </button>
                      <button v-on:click="increaseStartNumber" class="btn btn-default">Next</button>
                    </div>
                  </div>
                </div>
              </div>`
  });

  // Table-wrapper component manages state and renders child components.
  Vue.component('table-wrapper',{
    data:function () {
      return{
        json:{
          thead:[],
          tbody:[]
        },
        keys:[],
        showModal:false,
        displayNumber:10,
        startNumber:0,
        search:'',
        filter:[],
        sortUpBy:"",
        sortDownBy:""
      }
    },
    // Async get request for local json data.
    created:function () {
      axios.get('./data.json', {headers: { 'Content-Type': 'application/json' }})
        .then((response) => {
        this.json = response.data.users;
        console.log(response.data.users);

          for(var k in this.json[0]){
            this.keys.push(k);
          }

      });

    },
    methods:{

      // Parses the JSON data to CSV, creates a download link, then clicks it
      downloadExcel:function () {
        var ws;
        var wb;
        var wopts;
        var wbout;
        var wscol_widths = [];
        var i;

        for(i = 0; i< this.numberOfColumns; i++){
          wscol_widths[i] = {wch:this.excelHeaderColumnWidths[i]+1} // set the width of the row to the number of characters + 1
        }

        ws = XLSX.utils.json_to_sheet(this.sortedRows); // create worksheet with JSON Data
        ws['!cols'] = wscol_widths; // set worksheet column widths based on first row of table data
        wb = { SheetNames:[], Sheets:{} }; // create workbook
        wb.SheetNames.push("Data"); // Create sheet called Data in workbook
        wb.Sheets["Data"] = ws; // add ws to wb

        wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
        wbout = XLSX.write(wb,wopts);

        // saveAs is from fileSaver.js, downloads file
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "data.xlsx");

      },
      updateDisplayNumber:function (int){
        this.displayNumber = parseInt(int);
      },
      updateSearch:function (string){
        this.search = string;
      },
      updateFilter:function (array){
        this.filter = array;
      },
      updateSortUp:function(string){
        this.sortUpBy = string;
        this.sortDownBy = "";
      },
      updateSortDown:function(string){
        this.sortDownBy = string;
        this.sortUpBy = "";
      },
      showModalFunction:function() {
        this.showModal = true;
      },
      increaseStartNumber:function (val) {
        this.startNumber += parseInt(val);
      },
      decreaseStartNumber:function (val) {
        this.startNumber -= parseInt(val);
      },
      updateStartNumber:function (val) {
        this.startNumber = val;
      }
    },
    computed:{
      // Removes headers based on the active filters
      filteredHeaders:function () {

        var filters=this.filter;
        var jsonArray = this.keys;
        var returnArray = [];
        var i,j;
        var element;

        // parses the filters, which are stored as JSON, to strings
        if(filters.length > 0) { // if there is a filter active

          // removes the elements from the JSON objects that match the filters
          for (i = 0; i < jsonArray.length; i++) {
             if(jsonArray[i] !== filters[i]){
               returnArray.push(jsonArray[i]);
             }
          }
          return returnArray;

        }

        return jsonArray;
      },

      // Removes columns based on the active filters
      filteredRows:function(){
        var filters=this.filter;
        var jsonArray = this.json;
        var returnArray = [];
        var i,j;
        var element;

        // parses the filters, which are stored as JSON, to strings
        if(filters.length > 0) { // if there is a filter active

          // removes the elements from the JSON objects that match the filters
          for (i = 0; i < jsonArray.length; i++) {
            element = _.omit(jsonArray[i],filters);
            returnArray.push(element);
          }
          return returnArray;

        }

        return jsonArray;
      },

      //Finds the rows that match the searched value
      searchedRows:function () {
          var list = this.filteredRows;
          var options;
          var fuse;
          var result;

          if(this.search !== '') { // if there is a search value
            options = {
              shouldSort: true,
              threshold: 0.05,
              location: 0,
              distance: 100,
              maxPatternLength: 12,
              minMatchCharLength: 3,
              keys: this.keys
            };
            fuse = new Fuse(list, options); // fuzzy search library
            result = fuse.search(this.search);

            return result;
          }
          return list;
      },

      // Sorts the rows if an ascending or descending sort is active, and slices the array to the current displayNumber
      sortedRows:function(){
        var tableWrapper = this;
        var array = this.searchedRows;
        var elementA;
        var elementB;

        console.log(this.searchedRows);

        if(this.sortUpBy !== ""){
          array.sort(function(a, b){
            elementA=a[tableWrapper.sortUpBy];
            elementB=b[tableWrapper.sortUpBy];

            if(elementA === null){
              return 1;
            }

            if(elementB === null){
              return -1;
            }
              
            if (elementA < elementB){ //sort string descending
              return -1;
            }
            if (elementA > elementB){
              return 1;
            }
            return 0; //default return value (no sorting)

          });
        }

        else if(this.sortDownBy !== ""){
          array.sort(function(a, b){
            elementA=a[tableWrapper.sortDownBy];
            elementB=b[tableWrapper.sortDownBy];
            if(elementA === null){
              return 1;
            }
            if(elementB === null){
              return -1;
            }
            if (elementA > elementB){ //sort string ascending
              return -1;
            }
            if (elementA < elementB){
              return 1;
            }
            return 0; //default return value (no sorting)

          });
        }
        return array;
      },

      displayRows:function(){
        return this.sortedRows.slice(this.startNumber,this.startNumber + this.displayNumber);
      },
      numberOfRows:function () {
        return this.sortedRows.length;
      },
      numberOfTabs:function () {
        return Math.ceil(this.numberOfRows / this.displayNumber)
      },
      numberOfColumns:function () {
        var object;
        var count=0;
        if(this.filteredHeaders.length > 0){ // if the json data has populated
          for(object in this.filteredHeaders[0]){
            count ++;
          }
        }
        return count;
      },
      excelHeaderColumnWidths:function () {
        var object;
        var returnArray = [];
        var rows = this.filteredRows;

        if(rows.length > 0){ // if the json data has populated
          for( object in rows[0]) { // iterate the first row of the table data
            if(rows[0].hasOwnProperty(object)){ // if the json object is valid
              if(typeof rows[0][object] === "string"){ // if the object is a string
                returnArray.push(rows[0][object].length); // return the length of the string
              }
              else{
                returnArray.push(this.filteredHeaders[0][object].length) // return the length of the header of that column
              }
            }
          }
        }
        return returnArray;
      }
    },
    template:  `<div>
                  <navbar 
                    v-on:updateParentDisplayNumber="updateDisplayNumber" 
                    v-on:updateParentSearch="updateSearch" 
                    v-on:parentDownloadExcel="downloadExcel" 
                    v-on:parentShowModal="showModalFunction"
                    v-bind:numberOfRows="numberOfRows">
                  </navbar>
                  
                  <modal 
                    v-if="showModal"
                    v-bind:filter="filter"
                    v-bind:keys="this.keys"
                    @close="showModal = false" 
                    v-on:updateParentFilter="updateFilter">                 
                  </modal>
                  
                  <div class="table-responsive">
                    <TableComponent 
                      v-bind:thead="filteredHeaders" 
                      v-bind:tbody="displayRows" 
                      v-on:updateParentSortUp="updateSortUp" 
                      v-on:updateParentSortDown="updateSortDown">
                    </TableComponent>
                  </div>
                  
                  <navbar-footer
                    v-bind:startNumber="startNumber"
                    v-bind:numberOfRows="numberOfRows"
                    v-bind:displayNumber="displayNumber"
                    v-bind:numberOfTabs="numberOfTabs"
                    v-on:parentIncreaseStartNumber="increaseStartNumber"
                    v-on:parentDecreaseStartNumber="decreaseStartNumber"
                    v-on:parentUpdateStartNumber="updateStartNumber">
                  </navbar-footer>
                  
                </div>`
  });

  // Register instance of Vue and anchor it to the "app" div.
  var app = new Vue({
    el:'#app',
  });
})();


function s2ab(s) { // string to arrayBuffer, part of the Excel export process
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}