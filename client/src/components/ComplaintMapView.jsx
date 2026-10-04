import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'

const categoryMarkerColors = {
  'Potholes / Road Damage': '#f59e0b',
  'Roads': '#f59e0b',
  'Garbage & Sanitation': '#10b981',
  'Sanitation': '#10b981',
  'Drainage Blockage': '#06b6d4',
  'Water Leakage': '#38bdf8',
  'Water': '#38bdf8',
  'Damaged Streetlights': '#eab308',
  'Electricity & Hazards': '#8b5cf6',
  'Electricity': '#8b5cf6',
  'Other': '#94a3b8'
}

function createCustomPin(color = '#38bdf8') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${color}">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28]
  })
}

export function ComplaintMapView({
  complaints = [],
  height = '500px',
  selectedLocation = null,
  onLocationSelect = null,
  pickerMode = false,
  showHeatmap = false
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerGroupRef = useRef(null)
  const heatmapGroupRef = useRef(null)
  const pickerMarkerRef = useRef(null)

  const [mapReady, setMapReady] = useState(false)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const defaultCenter = selectedLocation?.latitude && selectedLocation?.longitude
        ? [Number(selectedLocation.latitude), Number(selectedLocation.longitude)]
        : [17.385, 78.4867] // Default coordinates (Hyderabad / Indian metro standard)

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      markerGroupRef.current = L.featureGroup().addTo(map)
      heatmapGroupRef.current = L.featureGroup().addTo(map)
      mapInstanceRef.current = map

      // Picker mode click handler
      if (pickerMode && onLocationSelect) {
        map.on('click', (event) => {
          const { lat, lng } = event.latlng
          onLocationSelect(lat.toFixed(6), lng.toFixed(6))
        })
      }

      setMapReady(true)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerGroupRef.current = null
        heatmapGroupRef.current = null
        pickerMarkerRef.current = null
      }
    }
  }, [pickerMode])

  // Update selected location in picker mode
  useEffect(() => {
    if (!mapInstanceRef.current || !pickerMode) return

    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      const lat = Number(selectedLocation.latitude)
      const lng = Number(selectedLocation.longitude)

      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        if (pickerMarkerRef.current) {
          pickerMarkerRef.current.setLatLng([lat, lng])
        } else {
          pickerMarkerRef.current = L.marker([lat, lng], {
            icon: createCustomPin('#06b6d4'),
            draggable: true
          }).addTo(mapInstanceRef.current)

          pickerMarkerRef.current.on('dragend', (event) => {
            const pos = event.target.getLatLng()
            onLocationSelect?.(pos.lat.toFixed(6), pos.lng.toFixed(6))
          })
        }
        mapInstanceRef.current.setView([lat, lng], 14)
      }
    }
  }, [selectedLocation?.latitude, selectedLocation?.longitude, pickerMode])

  // Render complaint markers and heatmap circles
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current || !heatmapGroupRef.current) return

    markerGroupRef.current.clearLayers()
    heatmapGroupRef.current.clearLayers()

    const validComplaints = complaints.filter(
      (c) => c.latitude != null && c.longitude != null && !Number.isNaN(Number(c.latitude)) && !Number.isNaN(Number(c.longitude))
    )

    if (validComplaints.length === 0) return

    const bounds = []

    validComplaints.forEach((complaint) => {
      const lat = Number(complaint.latitude)
      const lng = Number(complaint.longitude)
      const color = categoryMarkerColors[complaint.category] || '#38bdf8'

      bounds.push([lat, lng])

      // Heatmap density circles
      if (showHeatmap) {
        const upvoteWeight = Math.max(1, (complaint.upvotes?.length || complaint.upvoteCount || 0))
        const radius = Math.min(600, 150 + upvoteWeight * 50)

        const circle = L.circle([lat, lng], {
          radius: radius,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 0.4,
          fillOpacity: 0.25
        })
        heatmapGroupRef.current.addLayer(circle)
      }

      // Marker & Popup
      const marker = L.marker([lat, lng], {
        icon: createCustomPin(color)
      })

      const popupContent = document.createElement('div')
      popupContent.className = 'p-1 text-slate-100'
      popupContent.innerHTML = `
        <div style="min-width: 220px; font-family: inherit;">
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
            <span style="background: ${color}22; color: ${color}; border: 1px solid ${color}44; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
              ${complaint.category}
            </span>
            <span style="background: rgba(255,255,255,0.1); color: #e2e8f0; font-size: 10px; padding: 2px 8px; border-radius: 9999px;">
              ${complaint.status}
            </span>
          </div>
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #ffffff;">${complaint.title}</h4>
          <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.4;">
            ${complaint.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
          </p>
          ${complaint.images && complaint.images.length > 0 ? `
            <img src="${complaint.images[0]}" alt="Thumbnail" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          ` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
            <span style="font-size: 11px; color: #38bdf8; font-weight: 600;">
              👍 ${complaint.upvotes?.length || complaint.upvoteCount || 0} Upvotes
            </span>
            <a href="/complaints/${complaint._id}" style="font-size: 11px; background: #22d3ee; color: #020617; font-weight: 700; padding: 3px 10px; border-radius: 9999px; text-decoration: none;">
              Details →
            </a>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      markerGroupRef.current.addLayer(marker)
    })

    if (!pickerMode && bounds.length > 0) {
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
      } catch (err) {
        // Fallback
      }
    }
  }, [complaints, showHeatmap, pickerMode])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {pickerMode ? (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] rounded-2xl border border-white/15 bg-slate-900/90 p-3 text-xs text-slate-200 backdrop-blur-md">
          <p className="font-semibold text-cyan-300">📍 Interactive Coordinate Picker:</p>
          <p className="mt-0.5 text-slate-300">
            Click anywhere on the map or drag the pin to set the exact issue location.
            {selectedLocation?.latitude && selectedLocation?.longitude
              ? ` Selected: (${selectedLocation.latitude}, ${selectedLocation.longitude})`
              : ' No location pinned yet.'}
          </p>
        </div>
      ) : null}
    </div>
  )
}
