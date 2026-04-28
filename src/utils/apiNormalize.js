/**
 * Map Laravel API resources (often snake_case) into the camelCase shapes the SPA expects.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function looksLikeUuid(v) {
  return typeof v === 'string' && UUID_REGEX.test(v.trim())
}

/**
 * @param {Record<string, unknown> | null | undefined} raw
 * @returns {Record<string, unknown> | null}
 */
export function normalizeBookingFromApi(raw) {
  if (!raw || typeof raw !== 'object') return null

  const batchBookingsRaw = raw.batch_bookings
  let batchBookings = null
  if (Array.isArray(batchBookingsRaw)) {
    batchBookings = batchBookingsRaw.map((line) => ({
      uuid: line.uuid,
      reference: line.reference,
      unitName: line.unit_name,
      totalPrice: line.total_price != null ? Number(line.total_price) : null,
    }))
  }

  return {
    uuid: raw.uuid,
    reference: raw.reference,
    guestName: raw.guest_name,
    guestEmail: raw.guest_email,
    guestPhone: raw.guest_phone,
    unitUuid: raw.unit_uuid,
    unitId: raw.unit_uuid,
    propertyUuid: raw.property_uuid,
    propertyId: raw.property_uuid,
    unitName: raw.unit_name,
    accommodationName: raw.accommodation_name,
    unitType: raw.unit_type,
    beds: raw.beds,
    bedrooms: raw.bedrooms,
    maxGuests: raw.max_guests,
    checkIn: raw.check_in,
    checkOut: raw.check_out,
    adults: raw.adults,
    children: raw.children,
    totalPrice: raw.total_price != null ? Number(raw.total_price) : null,
    currency: raw.currency,
    source: raw.source,
    status: raw.status,
    notes: raw.notes,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    paidTotal: raw.paid_total != null ? Number(raw.paid_total) : undefined,
    balanceDue: raw.balance_due != null ? Number(raw.balance_due) : undefined,
    portalBatchId: raw.portal_batch_id,
    batchBookings,
    batchTotalPrice: raw.batch_total_price != null ? Number(raw.batch_total_price) : undefined,
    batchUnitNames: raw.batch_unit_names,
  }
}

/**
 * Admin calendar list: snake_case units/bookings/blocks → camelCase.
 * @param {unknown} payload
 */
export function normalizeCalendarResponse(payload) {
  if (!payload || typeof payload !== 'object') return payload
  const unitsRaw = payload.units
  const units = Array.isArray(unitsRaw)
    ? unitsRaw.map((u) => {
        const bookings = Array.isArray(u.bookings)
          ? u.bookings.map((b) => ({
              uuid: b.uuid,
              reference: b.reference,
              guestName: b.guest_name,
              checkIn: b.check_in,
              checkOut: b.check_out,
              status: b.status,
              source: b.source,
              totalPrice: b.total_price != null ? Number(b.total_price) : undefined,
              currency: b.currency,
              balanceDue: b.balance_due != null ? Number(b.balance_due) : undefined,
            }))
          : []
        const blocks = Array.isArray(u.blocks)
          ? u.blocks.map((k) => ({
              uuid: k.uuid,
              startDate: k.start_date,
              endDate: k.end_date,
              label: k.label,
              notes: k.notes,
            }))
          : []
        return {
          uuid: u.uuid,
          propertyId: u.property_uuid,
          propertyUuid: u.property_uuid,
          propertyName: u.property_name,
          name: u.name,
          type: u.type,
          maxGuests: u.max_guests,
          bedrooms: u.bedrooms,
          beds: u.beds,
          pricePerNight: u.price_per_night != null ? Number(u.price_per_night) : undefined,
          currency: u.currency,
          bookings,
          blocks,
        }
      })
    : []
  return { ...payload, units }
}

/**
 * @param {Record<string, unknown> | null | undefined} raw
 */
export function normalizeUnitDiscountFromApi(raw) {
  if (!raw || typeof raw !== 'object') return null

  return {
    uuid: raw.uuid,
    unitUuid: raw.unit_uuid,
    unitName: raw.unit_name,
    discountType: raw.discount_type,
    discountPercent: raw.discount_percent != null ? Number(raw.discount_percent) : null,
    minDaysInAdvance: raw.min_days_in_advance,
    minNights: raw.min_nights,
    validFrom: raw.valid_from,
    validTo: raw.valid_to,
    status: raw.status,
    createdAt: raw.created_at,
  }
}
