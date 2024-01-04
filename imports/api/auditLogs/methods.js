import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'
import { EJSON } from 'meteor/ejson'
import { concat, includes, isArray, isEmpty, isObject, isString } from 'lodash'
import moment from 'moment'

// CORE COLLECTIONS
import AuditLogs from './AuditLogs'
// import Branches from '/imports/api/branches/branches'
// import Employees from '/imports/api/employees/employees'
// import ChartAccounts from '/imports/api/chart-accounts/chart-accounts'
// import JournalClass from '/imports/api/journal-class/JournalClasses'
// import JournalName from '/imports/api/journal-names/JournalNames'
// import Locations from '/imports/api/locations/Locations'
// import PaymentMethods from '/imports/api/payment-methods/payment-methods'
// import AssetTypes from '/imports/api/asset-types/asset-types'

// // POS COLLECTIONS

// Data table
export const getAuditLogDataTable = new ValidatedMethod({
  name: 'app.getAuditLogDataTable',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
    query: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ selector, query }) {
    if (Meteor.isServer) {
      selector = selector || {}

      // Options
      const options = {
        sort: { createdAt: -1 },
        skip: (query.page - 1) * query.pageSize,
        limit: query.pageSize,
      }

      let match = {}
      if (!isEmpty(selector.date)) {
        const dateF = selector.date[0]
        const dateT = selector.date[1]
        match.createdAt = {
          $gte: dateF,
          $lte: dateT,
        }
      }
      if (!isEmpty(selector.event)) {
        match.event = { $in: selector.event }
      }

      let data = AuditLogs.aggregate([
        { $match: match },
        { $sort: options.sort },
        { $skip: options.skip },
        { $limit: options.limit },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      ])
      let total = AuditLogs.find(match).count()

      return { data, total }
    }
  },
})

// Get History
export const getAuditLogHistory = new ValidatedMethod({
  name: 'app.getAuditLogHistory',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  async run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = AuditLogs.aggregate([
        { $match: selector },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      ])
      for (let it of data) {
        if (it) {
          it.doc = EJSON.parse(it.data)
          it.data = EJSON.parse(it.data)
          it.doc = await lookupDataAuditLog(it)
        }
      }

      return data
    }
  },
})

// Insert
export const insertAuditLog = new ValidatedMethod({
  name: 'app.insertAuditLog',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    page: String,
    event: {
      type: String,
      allowedValues: ['LOG', 'ADD', 'EDIT', 'DELETE'],
    },
    title: String,
    data: {
      type: String,
      optional: true,
    },
    refId: {
      type: String,
      optional: true,
    },
    createdBy: {
      type: String,
      optional: true,
    },
  }).validator(),
  run(doc) {
    if (Meteor.isServer) {
      return AuditLogs.insert(doc)
    }
  },
})

const lookupDataAuditLog = async (data) => {
  let doc = data.doc
  const branchDoc = doc.branchId
    ? await Branches.findOne({ _id: doc.branchId })
    : null
  const employeeDoc = doc.employeeId
    ? await Employees.findOne({ _id: doc.employeeId })
    : null
  const locationDoc = doc.locationId
    ? await Locations.findOne({ _id: doc.locationId })
    : null
  const driverDoc = doc.driverId
    ? await Employees.findOne({ _id: doc.driverId })
    : null
  const assetTypeDoc = doc.assetTypeId
    ? await AssetTypes.findOne({ _id: doc.assetTypeId })
    : null

  const cashAccountDoc =
    doc.chartAccountId && doc.chartAccountId.cash
      ? await ChartAccounts.findOne({ _id: doc.chartAccountId.cash })
      : doc.chartAccountIds && doc.chartAccountIds.cash
      ? await ChartAccounts.findOne({ _id: doc.chartAccountIds.cash })
      : isString(doc.chartAccountId) && doc.chartAccountId
      ? await ChartAccounts.findOne({ _id: doc.chartAccountId })
      : isString(doc.cashAccountId) && doc.cashAccountId
      ? await ChartAccounts.findOne({ _id: doc.cashAccountId })
      : null
  const depositAccountDoc =
    doc.chartAccountId && doc.chartAccountId.deposit
      ? await ChartAccounts.findOne({ _id: doc.chartAccountId.deposit })
      : null
  const receivableAccountDoc =
    doc.chartAccountId && doc.chartAccountId.receivable
      ? await ChartAccounts.findOne({ _id: doc.chartAccountId.receivable })
      : null
  const payableAccountDoc =
    doc.chartAccountId && doc.chartAccountId.payable
      ? await ChartAccounts.findOne({ _id: doc.chartAccountId.payable })
      : null
  const tradeDiscountAccountDoc =
    doc.chartAccountId && doc.chartAccountId.tradeDiscount
      ? await ChartAccounts.findOne({ _id: doc.chartAccountId.tradeDiscount })
      : null
  const settlementDiscountAccountDoc =
    doc.chartAccountId && doc.chartAccountId.settlementDiscount
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountId.settlementDiscount,
        })
      : null
  const returnAccountDoc = doc.returnAccountId
    ? await ChartAccounts.findOne({
        _id: doc.returnAccountId,
      })
    : null

  const assetAccountDoc =
    doc.chartAccountId && doc.chartAccountId.asset
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountId.asset,
        })
      : doc.chartAccountIds && doc.chartAccountIds.asset
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.asset,
        })
      : null
  const expenseAccountDoc =
    doc.chartAccountId && doc.chartAccountId.expense
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountId.expense,
        })
      : null
  const revenueAccountDoc =
    doc.chartAccountId && doc.chartAccountId.revenue
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountId.revenue,
        })
      : null
  const accumulateAccountDoc =
    doc.chartAccountIds && doc.chartAccountIds.accumulatedDepreciation
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.accumulatedDepreciation,
        })
      : null
  const depAccountDoc =
    doc.chartAccountIds && doc.chartAccountIds.depreciationExpense
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.depreciationExpense,
        })
      : null
  const gainOnSaleAccountDoc =
    doc.chartAccountIds && doc.chartAccountIds.gainOnDisposalOrSaleFixedAsset
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.gainOnDisposalOrSaleFixedAsset,
        })
      : null
  const interBranchAccountDoc =
    doc.chartAccountIds && doc.chartAccountIds.interBranchesAcc
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.interBranchesAcc,
        })
      : null
  const lossOnSaleAccountDoc =
    doc.chartAccountIds && doc.chartAccountIds.lossOnDisposalOrSaleFixedAsset
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.lossOnDisposalOrSaleFixedAsset,
        })
      : null
  const lossOnWriteAccountDoc =
    doc.chartAccountIds &&
    doc.chartAccountIds.lossOnDisposalOrWriteoffFixedAsset
      ? await ChartAccounts.findOne({
          _id: doc.chartAccountIds.lossOnDisposalOrWriteoffFixedAsset,
        })
      : null

  doc.tranDate
    ? (doc.tranDate = moment(doc.tranDate).format('DD/MM/YYYY HH:mm:ss'))
    : ''
  doc.receivedDate
    ? (doc.receivedDate = moment(doc.receivedDate).format(
        'DD/MM/YYYY HH:mm:ss'
      ))
    : ''
  doc.deliveryDate
    ? (doc.deliveryDate = moment(doc.deliveryDate).format(
        'DD/MM/YYYY HH:mm:ss'
      ))
    : ''

  doc.statusDate && doc.statusDate.closed
    ? (doc.statusDate.closed = moment(doc.statusDate.closed).format(
        'DD/MM/YYYY HH:mm:ss'
      ))
    : ''
  doc.statusDate && doc.statusDate.open
    ? (doc.statusDate.open = moment(doc.statusDate.open).format(
        'DD/MM/YYYY HH:mm:ss'
      ))
    : ''
  doc.dueDate
    ? (doc.dueDate = moment(doc.dueDate).format('DD/MM/YYYY HH:mm:ss'))
    : ''
  doc.expectedDate
    ? (doc.expectedDate = moment(doc.expectedDate).format(
        'DD/MM/YYYY HH:mm:ss'
      ))
    : ''
  doc.expectDate
    ? (doc.expectDate = moment(doc.expectDate).format('DD/MM/YYYY HH:mm:ss'))
    : ''
  doc.registerDate
    ? (doc.registerDate = moment(doc.registerDate).format(
        'DD/MM/YYYY HH:mm:ss'
      ))
    : ''

  // PICK DATA
  branchDoc ? (doc.branchId = branchDoc.name) : ''
  locationDoc ? (doc.locationId = locationDoc.name) : ''
  employeeDoc ? (doc.employeeId = employeeDoc.name) : ''
  driverDoc ? (doc.driverId = driverDoc.name) : ''
  assetTypeDoc ? (doc.assetTypeId = assetTypeDoc.name) : ''
  returnAccountDoc ? (doc.returnAccountId = returnAccountDoc.name) : ''

  if (isObject(doc.chartAccountId) || isObject(doc.chartAccountIds)) {
    if (cashAccountDoc) {
      doc.chartAccountId && doc.chartAccountId.cash
        ? (doc.chartAccountId.cash = cashAccountDoc.name)
        : ''
      doc.chartAccountIds && doc.chartAccountIds.cash
        ? (doc.chartAccountIds.cash = cashAccountDoc.name)
        : ''
    }
    if (assetAccountDoc) {
      doc.chartAccountId && doc.chartAccountId.asset
        ? (doc.chartAccountId.asset = assetAccountDoc.name)
        : ''
      doc.chartAccountIds && doc.chartAccountIds.asset
        ? (doc.chartAccountIds.asset = assetAccountDoc.name)
        : ''
    }
    depositAccountDoc
      ? (doc.chartAccountId.deposit = depositAccountDoc.name)
      : ''
    receivableAccountDoc
      ? (doc.chartAccountId.receivable = receivableAccountDoc.name)
      : ''
    payableAccountDoc
      ? (doc.chartAccountId.payable = payableAccountDoc.name)
      : ''
    tradeDiscountAccountDoc
      ? (doc.chartAccountId.tradeDiscount = tradeDiscountAccountDoc.name)
      : ''
    settlementDiscountAccountDoc
      ? (doc.chartAccountId.settlementDiscount =
          settlementDiscountAccountDoc.name)
      : ''

    expenseAccountDoc
      ? (doc.chartAccountId.expense = expenseAccountDoc.name)
      : ''
    revenueAccountDoc
      ? (doc.chartAccountId.revenue = revenueAccountDoc.name)
      : ''

    accumulateAccountDoc
      ? (doc.chartAccountIds.accumulatedDepreciation =
          accumulateAccountDoc.name)
      : ''
    depAccountDoc
      ? (doc.chartAccountIds.depreciationExpense = depAccountDoc.name)
      : ''
    gainOnSaleAccountDoc
      ? (doc.chartAccountIds.gainOnDisposalOrSaleFixedAsset =
          gainOnSaleAccountDoc.name)
      : ''
    interBranchAccountDoc
      ? (doc.chartAccountIds.interBranchesAcc = interBranchAccountDoc.name)
      : ''
    lossOnSaleAccountDoc
      ? (doc.chartAccountIds.lossOnDisposalOrSaleFixedAsset =
          lossOnSaleAccountDoc.name)
      : ''
    lossOnWriteAccountDoc
      ? (doc.chartAccountIds.lossOnDisposalOrWriteoffFixedAsset =
          lossOnWriteAccountDoc.name)
      : ''
  } else {
    if (cashAccountDoc) {
      doc.chartAccountId ? (doc.chartAccountId = cashAccountDoc.name) : ''
      doc.cashAccountId ? (doc.cashAccountId = cashAccountDoc.name) : ''
    }
  }

  doc.details =
    doc.details && doc.details.length ? await pickDetailData(doc.details) : ''

  doc.itemDetails =
    doc.itemDetails && doc.itemDetails.length
      ? await pickDetailData(doc.itemDetails)
      : ''

  doc.accDetails =
    doc.accDetails && doc.accDetails.length
      ? await pickDetailData(doc.accDetails)
      : ''

  let coreReplaceMent = [
    'branchId',
    'employeeId',
    'chartAccountId',
    'cashAccountId',
    'locationId',
    'driverId',
    'assetTypeId',
    'chartAccountIds',
  ]

  let posReplaceMent = []

  let mergeReplaceMent = concat(coreReplaceMent, posReplaceMent)
  return replaceValue(doc, mergeReplaceMent)
}

const pickDetailData = async (details) => {
  let result = []
  for (let it of details) {
    it.tranDate = it.tranDate
      ? moment(it.tranDate).format('DD/MM/YYYY HH:mm:ss')
      : ''
    let chartAccountDoc = it.chartAccountId
      ? await ChartAccounts.findOne({
          _id: it.chartAccountId,
        })
      : null
    let branchDoc = it.branchId
      ? await Branches.findOne({ _id: it.branchId })
      : null
    let journalClassDoc =
      it.journalClassId || it.classId
        ? await JournalClass.findOne({ _id: it.journalClassId || it.classId })
        : null
    let journalNameDoc = it.nameId
      ? await JournalName.findOne({ _id: it.nameId })
      : null
    let employeeDoc = it.employeeId
      ? await Employees.findOne({ _id: it.employeeId })
      : null
    const paymentMethodDoc = it.paymentMethodId
      ? await PaymentMethods.findOne({ _id: it.paymentMethodId })
      : null

    branchDoc ? (it.branchId = branchDoc.name) : ''
    journalClassDoc && it.journalClassId
      ? (it.journalClassId = journalClassDoc.name)
      : journalClassDoc && it.classId
      ? (it.classId = journalClassDoc.name)
      : ''
    journalNameDoc ? (it.nameId = journalNameDoc.name) : ''
    employeeDoc ? (it.employeeId = employeeDoc.name) : ''
    chartAccountDoc ? (it.chartAccountId = chartAccountDoc.name) : ''
    paymentMethodDoc ? (it.paymentMethodId = paymentMethodDoc.name) : ''

    let replaceMent = [
      'branchId',
      'chartAccountId',
      'journalClassId',
      'classId',
      'nameId',
      'employeeId',
      'paymentMethodId',
    ]

    let res = replaceValue(it, replaceMent)
    result.push(res)
  }
  return result
}

const replaceValue = (doc, replaceMent) => {
  let fieldObject = Object.keys(doc).map(function (key) {
    return key
  })
  let result = {}
  for (let it of fieldObject) {
    if (isObject(doc[it]) && !isArray(doc[it])) {
      doc[it] = !isEmpty(replaceSubObject(doc[it]))
        ? replaceSubObject(doc[it])
        : ''
    }
    if (it && doc[it]) {
      let isRep = includes(replaceMent, it)
      let rep = isRep ? it.replace('Id', '') : it
      result[rep] = doc[it]
    }
  }

  let sortable = Object.keys(result)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = result[key]

      return accumulator
    }, {})
  return sortable
}

// REPLACE SUB OBJECT EX: {branchId:'01',chartAccountId:{}}
const replaceSubObject = (value) => {
  if (isObject(value)) {
    let subObject = Object.keys(value).map(function (key) {
      return key
    })

    if (subObject && subObject.length) {
      let resSub = {}
      for (let acc of subObject) {
        if (acc && value[acc]) {
          resSub[acc] = value[acc]
        }
      }
      let result = (value = resSub)

      let sortable = Object.keys(result)
        .sort()
        .reduce((accumulator, key) => {
          accumulator[key] = result[key]

          return accumulator
        }, {})

      return sortable
    }
  }
}