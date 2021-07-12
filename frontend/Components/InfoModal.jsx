/* eslint-disable linebreak-style */
// @flow
import * as React from 'react';

export default function InfoModal(): React.Node {
  return (
    <div className="modal fade" id="InfoModal" tabIndex="-1" aria-labelledby="InfoModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body text-center p-4">
            <h5>這是個整理1922以外的預約方式的網站</h5>
            <p>所有第9類—高風險疾病者、罕見疾病及重大傷病患，或第6、8、10類—民國60年(含)以前出生者，需經由 1922網站進行預約。</p>
            <div className="d-grid">
              <a role="button" className="btn btn-outline-primary mb-2" href="https://1922.gov.tw/vas/" target="_blank" rel="noreferrer">前往 1922 網站</a>
              <button type="button" className="btn btn-primary mb-2" data-bs-dismiss="modal" aria-label="Close">進入本網站 開始找疫苗</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
