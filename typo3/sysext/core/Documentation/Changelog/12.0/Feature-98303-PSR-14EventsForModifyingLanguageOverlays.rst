.. include:: /Includes.rst.txt

.. _feature-98303-1662659478:

===============================================================
Feature: #98303 - PSR-14 Events for modifying language overlays
===============================================================

See :issue:`98303`

Description
===========

Three new PSR-14 events have been introduced which serve as a more powerful
and flexible alternative for the now removed
:php:`$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_page.php']['getRecordOverlay']`
and :php:`$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['t3lib/class.t3lib_page.php']['getPageOverlay']`
hooks.

The new PSR-14 Events allow listeners to modify corresponding information,
before and after TYPO3 tries to overlay a language version of any kind of
record. "Language Overlaying" is a core concept of TYPO3 to find a suitable
translation for a record and merged together with the base record.

* :php:`\TYPO3\CMS\Core\Domain\Event\BeforeRecordLanguageOverlayEvent`
* :php:`\TYPO3\CMS\Core\Domain\Event\AfterRecordLanguageOverlayEvent`
* :php:`\TYPO3\CMS\Core\Domain\Event\BeforePageLanguageOverlayEvent`

Impact
======

The Event :php:`\TYPO3\CMS\Core\Domain\Event\BeforeRecordLanguageOverlayEvent`
can be used to modify information (such as the :php:`LanguageAspect`
or the actual incoming record from the database) before the database
is queried.

The Event :php:`\TYPO3\CMS\Core\Domain\Event\AfterRecordLanguageOverlayEvent`
can be used to modify the actual translated record (if found) to add additional
information or do custom processing of the record.

:php:`\TYPO3\CMS\Core\Domain\Event\BeforePageLanguageOverlayEvent` is a special
Event which is fired when TYPO3 is about to do the language overlay of one or
multiple pages, which could be one full record, or multiple page Ids. This
event is fired only for pages and in-between the events above.

.. index:: Frontend, PHP-API, ext:core
