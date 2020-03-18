import React, { useEffect, useRef } from "react";
const $ = require("jquery");
require("datatables.net-buttons-bs4")();
require("datatables.net-buttons/js/buttons.flash.js")();
require("datatables.net-buttons/js/buttons.html5.js")();
require("datatables.net-buttons/js/buttons.print.js")();
require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net-bs4");

const DataTable = props => {
  const TableElement = useRef(null);

  useEffect(
    () => {
      $(TableElement.current).DataTable({
        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdfHtml5", "print"]
      });
    },
    [],
    () => {
      $(TableElement.current).DataTable.destroy(true);
    }
  );
  const listItems = props.TableHeader.map(data => <th key={data}>{data}</th>);

  const listRows = props.data.map(data => (
    <tr key={data.id}>
      <TableRow rowData={props.rowData} data={data} />

      <th>
        <a
          href="#modal-message"
          data-toggle="modal"
          style={{ color: "#007bff" }}
          onClick={e => props.handleEdit(data, e)}
        >
          <i className="fa fa-edit"></i>
        </a>
        |
        <a
          href="#"
          style={{ color: "#f44542" }}
          onClick={e => props.handleDelete(data.id, e)}
        >
          <i className="fa fa-trash"></i>
        </a>
      </th>
    </tr>
  ));
  return (
    <div>
      <h1 className="page-header">{props.page}</h1>

      <div className="row">
        <div className="col-lg-12">
          <div className="panel panel-inverse">
            <div className="panel-heading">
              <div className="panel-heading-btn">
                <a

                  className="btn btn-xs btn-icon btn-circle btn-default"
                  data-click="panel-expand"
                >
                  <i className="fa fa-expand" />
                </a>
                <a

                  className="btn btn-xs btn-icon btn-circle btn-success"
                  data-click="panel-reload"
                >
                  <i className="fa fa-redo" />
                </a>
                <a

                  className="btn btn-xs btn-icon btn-circle btn-warning"
                  data-click="panel-collapse"
                >
                  <i className="fa fa-minus" />
                </a>
                <a

                  className="btn btn-xs btn-icon btn-circle btn-danger"
                  data-click="panel-remove"
                >
                  <i className="fa fa-times" />
                </a>
              </div>
              <div className="panel-title ">
                <a
                  href="#modal-message"
                  data-toggle="modal"
                  className="btn btn-sm btn-icon btn-circle btn-success"
                >
                  <i className="fas fa-plus-circle" />
                </a>
                <span style={{ padding: 10 }}> Add New</span>
              </div>
            </div>

            <div className="panel-body">
              <table
                className="table table-striped table-bordered responsive nowrap"
                ref={TableElement} width="100%"
              >
                <thead>
                  <tr>{listItems}</tr>
                </thead>
                <tbody>{listRows}</tbody>
                <tfoot>
                  <tr>{listItems}</tr>
                </tfoot>
              </table>
            </div>

            <div className="modal modal-message fade" id="modal-message">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add {props.page}</h4>
                    <button
                      onClick={props.HandleOnClose}
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-hidden="true"
                    >
                      ×
                    </button>
                  </div>
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
const TableRow = props => {
  const values = props.rowData;
  return values.map((row, index) => {
    var res = row.split(".");
    let column;
    if (res.length > 1) {
      column = (props.data[res[0]] || {})[res[1]];
    } else {
      column = props.data[res[0]] || null;
    }

    return <th key={index}>{column}</th>;
  });
};
const Row = props => {
  return <th>{props.data}</th>;
};
