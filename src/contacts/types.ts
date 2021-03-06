/*
* This file was generated by a tool.
* Rerun sql-ts to regenerate this file.
*/
export interface ACHANGE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZCHANGETYPE": number | null 
  "ZENTITY": number | null 
  "ZENTITYPK": number | null 
  "ZTRANSACTIONID": number | null 
  "ZCOLUMNS": any | null 
  "ZTOMBSTONE0": any | null 
  "ZTOMBSTONE1": any | null 
  "ZTOMBSTONE2": any | null 
  "ZTOMBSTONE3": any | null 
}
export interface ATRANSACTION {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZAUTHORTS": number | null 
  "ZBUNDLEIDTS": number | null 
  "ZCONTEXTNAMETS": number | null 
  "ZPROCESSIDTS": number | null 
  "ZTIMESTAMP": number | null 
  "ZAUTHOR": string | null 
  "ZBUNDLEID": string | null 
  "ZCONTEXTNAME": string | null 
  "ZPROCESSID": string | null 
  "ZQUERYGEN": any | null 
}
export interface ATRANSACTIONSTRING {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZNAME": string | null 
}
export interface Z17PARENTGROUPS {
  "Z_17CHILDGROUPS"?: number | null 
  "Z_18PARENTGROUPS": number | null 
}
export interface Z21PARENTGROUPS {
  "Z_21CONTACTS"?: number | null 
  "Z_18PARENTGROUPS1": number | null 
}
export interface ZMETADATA {
  "Z_VERSION"?: number | null 
  "Z_UUID": string | null 
  "Z_PLIST": any | null 
}
export interface ZMODELCACHE {
  "Z_CONTENT": any | null 
}
export interface ZPRIMARYKEY {
  "Z_ENT"?: number | null 
  "Z_NAME": string | null 
  "Z_SUPER": number | null 
  "Z_MAX": number | null 
}
export interface ZABCDALERTTONE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZTONEDATA": string | null 
  "ZTYPE": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDCALENDARURI {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
  "ZURL": string | null 
}
export interface ZABCDCONTACTDATE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZDATEYEAR": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZDATE": Date | null 
  "ZDATEYEARLESS": number | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDCONTACTINDEX {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZCONTACT": number | null 
  "Z21_CONTACT": number | null 
  "ZSTRINGFORINDEXING": string | null 
}
export interface ZABCDCUSTOMPROPERTY {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZVALUETYPE": number | null 
  "ZPROPERTYNAME": string | null 
  "ZRECORDTYPE": string | null 
}
export interface ZABCDCUSTOMPROPERTYVALUE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZDATEVALUEYEAR": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZCUSTOMPROPERTY": number | null 
  "ZOWNER": number | null 
  "Z16_OWNER": number | null 
  "ZDATEVALUE": Date | null 
  "ZDATEVALUEYEARLESS": number | null 
  "ZNUMBERVALUE": number | null 
  "ZLABEL": string | null 
  "ZSTRINGVALUE": string | null 
  "ZUNIQUEID": string | null 
  "ZDATAVALUE": any | null 
}
export interface ZABCDDATECOMPONENTS {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZDAY": number | null 
  "ZERA": number | null 
  "ZISLEAPMONTH": number | null 
  "ZMONTH": number | null 
  "ZYEAR": number | null 
  "ZCONTACT": number | null 
  "Z21_CONTACT": number | null 
  "ZCALENDARIDENTIFIER": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDDELETEDRECORDLOG {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZCONTAINER": number | null 
  "ZDELETEDRECORDUNIQUEID": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDDISTRIBUTIONLISTCONFIG {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZADDRESS": number | null 
  "ZCONTACT": number | null 
  "Z21_CONTACT": number | null 
  "ZEMAIL": number | null 
  "ZGROUP": number | null 
  "Z18_GROUP": number | null 
  "ZPHONE": number | null 
  "ZPROPERTYNAME": string | null 
}
export interface ZABCDEMAILADDRESS {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZADDRESS": string | null 
  "ZADDRESSNORMALIZED": string | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDLIKENESS {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZKIND": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
  "ZVERSION": string | null 
  "ZDATA": any | null 
}
export interface ZABCDMESSAGINGADDRESS {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZSERVICE": number | null 
  "ZADDRESS": string | null 
  "ZBUNDLEIDENTIFIERSSTRING": string | null 
  "ZLABEL": string | null 
  "ZTEAMIDENTIFIER": string | null 
  "ZUNIQUEID": string | null 
  "ZUSERIDENTIFIER": string | null 
}
export interface ZABCDNOTE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZCONTACT": number | null 
  "Z21_CONTACT": number | null 
  "ZTEXT": string | null 
  "ZRICHTEXTDATA": any | null 
}
export interface ZABCDPHONENUMBER {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZAREACODE": string | null 
  "ZCOUNTRYCODE": string | null 
  "ZEXTENSION": string | null 
  "ZFULLNUMBER": string | null 
  "ZLABEL": string | null 
  "ZLASTFOURDIGITS": string | null 
  "ZLOCALNUMBER": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDPOSTALADDRESS {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZCITY": string | null 
  "ZCOUNTRYCODE": string | null 
  "ZCOUNTRYNAME": string | null 
  "ZLABEL": string | null 
  "ZREGION": string | null 
  "ZSAMA": string | null 
  "ZSTATE": string | null 
  "ZSTREET": string | null 
  "ZSUBLOCALITY": string | null 
  "ZUNIQUEID": string | null 
  "ZZIPCODE": string | null 
  "ZCUSTOMVALUESDICTIONARY": any | null 
}
export interface ZABCDRECORD {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZCREATIONDATEYEAR": number | null 
  "ZDISPLAYFLAGS": number | null 
  "ZMODIFICATIONDATEYEAR": number | null 
  "ZCONTAINER": number | null 
  "ZISALL": number | null 
  "ZINFO": number | null 
  "ZME": number | null 
  "Z21_ME": number | null 
  "ZBIRTHDAYYEAR": number | null 
  "ZPREFERREDFORLINKNAME": number | null 
  "ZPREFERREDFORLINKPHOTO": number | null 
  "ZPRIVACYFLAGS": number | null 
  "ZCONTAINER1": number | null 
  "ZCONTACTINDEX": number | null 
  "ZLUNARBIRTHDAYCOMPONENTS": number | null 
  "ZNOTE": number | null 
  "ZCONTAINERWHERECONTACTISME": number | null 
  "ZASSISTANTSYNCANCHOR": number | null 
  "ZSHARECOUNT": number | null 
  "ZSYNCCOUNT": number | null 
  "ZVERSION": number | null 
  "ZCONTAINER2": number | null 
  "ZCREATIONDATE": Date | null 
  "ZCREATIONDATEYEARLESS": number | null 
  "ZMODIFICATIONDATE": Date | null 
  "ZMODIFICATIONDATEYEARLESS": number | null 
  "ZLASTSYNCDATE": Date | null 
  "ZBIRTHDAY": Date | null 
  "ZBIRTHDAYYEARLESS": number | null 
  "ZUNIQUEID": string | null 
  "ZNAME": string | null 
  "ZNAMENORMALIZED": string | null 
  "ZTMPREMOTELOCATION": string | null 
  "ZNAME1": string | null 
  "ZREMOTELOCATION": string | null 
  "ZSERIALNUMBER": string | null 
  "ZCROPRECT": string | null 
  "ZCROPRECTID": string | null 
  "ZDEPARTMENT": string | null 
  "ZDOWNTIMEWHITELIST": string | null 
  "ZFIRSTNAME": string | null 
  "ZIDENTITYUNIQUEID": string | null 
  "ZIMAGEREFERENCE": string | null 
  "ZJOBTITLE": string | null 
  "ZLASTNAME": string | null 
  "ZLINKID": string | null 
  "ZMAIDENNAME": string | null 
  "ZMIDDLENAME": string | null 
  "ZNICKNAME": string | null 
  "ZORGANIZATION": string | null 
  "ZPHONEMEDATA": string | null 
  "ZPHONETICFIRSTNAME": string | null 
  "ZPHONETICLASTNAME": string | null 
  "ZPHONETICMIDDLENAME": string | null 
  "ZPHONETICORGANIZATION": string | null 
  "ZPREFERREDAPPLEPERSONAIDENTIFIER": string | null 
  "ZPREFERREDLIKENESSSOURCE": string | null 
  "ZSORTINGFIRSTNAME": string | null 
  "ZSORTINGLASTNAME": string | null 
  "ZSUFFIX": string | null 
  "ZTITLE": string | null 
  "ZTMPHOMEPAGE": string | null 
  "ZASSISTANTVALIDITY": string | null 
  "ZCREATEDVERSION": string | null 
  "ZLASTDOTMACACCOUNT": string | null 
  "ZLASTSAVEDVERSION": string | null 
  "ZSYNCANCHOR": string | null 
  "ZMODIFIEDUNIQUEIDSDATA": any | null 
  "ZSEARCHELEMENTDATA": any | null 
  "ZCROPRECTHASH": any | null 
  "ZIMAGEDATA": any | null 
  "ZTHUMBNAILIMAGEDATA": any | null 
  "ZEXTERNALUUID": string | null 
  "ZEXTERNALHASH": string | null 
  "ZEXTERNALREPRESENTATION": any | null 
  "ZSYNCSTATUS": number | null 
  "ZEXTERNALMODIFICATIONTAG": string | null 
  "ZEXTERNALGROUPBEHAVIOR": number | null 
  "ZEXTERNALCOLLECTIONPATH": string | null 
  "ZGUARDIANFLAGS": number | null 
  "ZEXTERNALURI": string | null 
  "ZEXTERNALIMAGEURI": string | null 
  "ZIMAGEHASH": any | null 
  "ZEXTERNALFILENAME": string | null 
  "ZIMAGETYPE": string | null 
}
export interface ZABCDRELATEDNAME {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZLABEL": string | null 
  "ZNAME": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDREMOTELOCATION {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z16_OWNER": number | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
  "ZURL": string | null 
}
export interface ZABCDSERVICE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZSERVICENAME": string | null 
}
export interface ZABCDSHARINGACCESSCONTROLENTRY {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "ZREADACLSOURCE": number | null 
  "ZREADWRITEACLSOURCE": number | null 
  "ZACCOUNTNAME": string | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
}
export interface ZABCDSOCIALPROFILE {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZBUNDLEIDENTIFIERSSTRING": string | null 
  "ZDISPLAYNAME": string | null 
  "ZLABEL": string | null 
  "ZSERVICENAME": string | null 
  "ZTEAMIDENTIFIER": string | null 
  "ZUNIQUEID": string | null 
  "ZURLSTRING": string | null 
  "ZUSERIDENTIFIER": string | null 
  "ZUSERNAME": string | null 
  "ZCUSTOMVALUESDATA": any | null 
}
export interface ZABCDUNKNOWNPROPERTY {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZOWNER": number | null 
  "Z16_OWNER": number | null 
  "ZPROPERTYNAME": string | null 
  "ZORIGINALLINE": any | null 
}
export interface ZABCDURLADDRESS {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZISPRIMARY": number | null 
  "ZISPRIVATE": number | null 
  "ZORDERINGINDEX": number | null 
  "ZOWNER": number | null 
  "Z21_OWNER": number | null 
  "ZLABEL": string | null 
  "ZUNIQUEID": string | null 
  "ZURL": string | null 
}
export interface ZCNCDCHANGEHISTORYCLIENT {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZNEEDSFULLSYNCNUMBER": number | null 
  "ZIDENTIFIER": string | null 
  "ZLASTTOKENDATA": any | null 
}
export interface ZCNCDUNIFIEDCONTACTINFO {
  "Z_PK"?: number | null 
  "Z_ENT": number | null 
  "Z_OPT": number | null 
  "ZCHANGETYPENUMBER": number | null 
  "ZINHIBITSINDIVIDUALCONTACTNUMBER": number | null 
  "ZLINKEDRECORDIDENTIFIERSSTRING": string | null 
  "ZUNIFIEDRECORDIDENTIFIER": string | null 
}

