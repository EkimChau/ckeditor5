/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module engine/view/observer/inputobserver
 */

import DomEventObserver from './domeventobserver';
import DataTransfer from '../datatransfer';

/**
 * Observer for events connected with data input.
 *
 * **Note**: This observer is attached by {@link module:engine/view/view~View} and available by default in all
 * editor instances.
 *
 * @extends module:engine/view/observer/domeventobserver~DomEventObserver
 */
export default class InputObserver extends DomEventObserver {
	constructor( view ) {
		super( view );

		this.domEventType = [ 'beforeinput' ];
	}

	onDomEvent( domEvent ) {
		const domTargetRanges = domEvent.getTargetRanges();
		const view = this.view;
		const viewDocument = view.document;

		let dataTransfer = null;
		let data = null;
		let targetRanges;

		if ( domEvent.dataTransfer ) {
			dataTransfer = new DataTransfer( domEvent.dataTransfer );
		}

		if ( domEvent.data ) {
			data = domEvent.data;
		} else if ( dataTransfer ) {
			data = dataTransfer.getData( 'text/plain' );
		}

		// There's no way a DOM range anchored in the fake selection container (and this is the only thing the event "knows")
		// can be mapped correctly to an editing view range. Fake selection container is not an editing view element, that's it.
		// Luckily, at the same time, if the selection is fake, it means that some object is selected and the input range
		// should simply surround it, so here it goes:
		if ( viewDocument.selection.isFake ) {
			targetRanges = [ viewDocument.selection.getFirstRange() ];
		} else {
			targetRanges = domTargetRanges.map( domRange => {
				return view.domConverter.domRangeToView( domRange );
			} );
		}

		this.fire( domEvent.type, domEvent, {
			data,
			dataTransfer,
			domTargetRanges,
			isComposing: domEvent.isComposing,
			targetRanges,
			inputType: domEvent.inputType
		} );
	}
}

/**
 * Fired before the web browser inputs, deletes, or formats some data.
 *
 * **Note**: This event is available only in browsers which support the DOM [`beforeinput`](https://www.w3.org/TR/input-events-2/) event.
 *
 * This event is introduced by {@link module:engine/view/observer/inputobserver~InputObserver} and available
 * by default in all editor instances (attached by {@link module:engine/view/view~View}).
 *
 * @see module:engine/view/observer/inputobserver~InputObserver
 * @event module:engine/view/document~Document#event:beforeinput
 * @param {module:engine/view/observer/inputobserver~InputEventData} data Event data containing detailed information about the event.
 */

/**
 * The value of the {@link module:engine/view/document~Document#event:beforeinput} event.
 *
 * @class module:engine/view/observer/inputobserver~InputEventData
 * @extends module:engine/view/observer/domeventdata~DomEventData
 */

/**
 * The data transfer instance of the input event. Corresponds to native `InputEvent#dataTransfer`.
 *
 * The value is `null` when no `dataTransfer` was passed along with the input event.
 *
 * @readonly
 * @member {module:engine/view/datatransfer~DataTransfer|null} module:engine/view/observer/inputobserver~InputEventData#dataTransfer
 */

/**
 * An array of target ranges passed along with the input event. Corresponds to the output of native `InputEvent#getTargetRanges()`.
 *
 * @readonly
 * @member {Array.<Range>} module:engine/view/observer/inputobserver~InputEventData#domTargetRanges
 */

/**
 * A flag indicating that the `beforeinput` event was fired during composition.
 *
 * Corresponds to the
 * {@link module:engine/view/document~Document#event:compositionstart},
 * {@link module:engine/view/document~Document#event:compositionupdate},
 * and {@link module:engine/view/document~Document#event:compositionend } trio.
 *
 * @readonly
 * @member {Boolean} module:engine/view/observer/inputobserver~InputEventData#isComposing
 */

/**
 * The type of the input event (e.g. "insertText" or "deleteWordBackward"). Corresponds to native `InputEvent#inputType`.
 *
 * @readonly
 * @member {String} module:engine/view/observer/inputobserver~InputEventData#inputType
 */

/**
 * Editing view ranges corresponding to
 * {@link module:engine/view/observer/inputobserver~InputEventData#domTargetRanges DOM ranges} passed along with the input event.
 *
 * @readonly
 * @member {Array.<module:engine/view/range~Range>} module:engine/view/observer/inputobserver~InputEventData#targetRanges
 */

/**
 * A unified text data passed along with the input event. Depending on:
 *
 * * the web browser and input events implementation (for instance [Level 1](https://www.w3.org/TR/input-events-1/) or
 * [Level 2](https://www.w3.org/TR/input-events-2/)),
 * * {@link module:engine/view/observer/inputobserver~InputEventData#inputType input type}
 *
 * text data is sometimes passed in the `data` and sometimes in the `dataTransfer` property.
 *
 * * If `InputEvent#data` was set, this property reflects its value.
 * * If `InputEvent#data` is unavailable, this property contains the `'text/plain'` data from
 * {@link module:engine/view/observer/inputobserver~InputEventData#dataTransfer}.
 * * If the event ({@link module:engine/view/observer/inputobserver~InputEventData#inputType input type})
 * provides no data whatsoever, this property is `null`.
 *
 * @readonly
 * @member {String|null} module:engine/view/observer/inputobserver~InputEventData#data
 */
